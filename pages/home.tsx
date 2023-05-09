import { useEffect, useState } from 'react';
import {getSession, useSession} from 'next-auth/react';
import Head from 'next/head';
import {Link, List, ListItem, Sheet, Typography, Button, ListDivider} from '@mui/joy';
import Layout from '../components/layout';
import getServerList from "../utils/serverlist";
import Console from "../components/console";

export async function getServerSideProps(context) {
    const session = await getSession(context);

    if (!session) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        };
    }

    return {
        props: {
            user: session?.user?.name,
        },
    };
}

function ServerListItem({ ws, game, running }: { ws: WebSocket, game: string, running: 'pinging' | boolean }) {
    // const [running, setRunning] = useState<'pinging' | boolean>('pinging');
    //
    // useEffect(() => {
    //     // const ws = new WebSocket('ws://localhost:443');
    //
    //     ws.onopen = function () {
    //         const username = localStorage.getItem('username');
    //         ws.send(JSON.stringify({ type: 'username', username: username }));
    //     };
    //
    //     ws.onmessage = function (event: any) {
    //         const data = JSON.parse(event.data);
    //         if (data.type === 'serverState' && data.game === game) {
    //             setRunning(data.running);
    //         }
    //     };
    //
    //     // ws.send(JSON.stringify({ type: 'getState', game: game }));
    //
    //     return () => {
    //         ws.close();
    //     };
    //
    // }, [game]);

    const gameName = game === 'pz' ? 'Project Zomboid' : game.charAt(0).toUpperCase() + game.slice(1);

    return (
        <ListItem sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <List orientation="horizontal" id={game} sx={{ flex: 1 }}>
                <ListItem><img src={`../img/${game}.png`} alt={game}/></ListItem>
                <ListItem sx={{ justifyContent: 'center', width: '50%' }}>
                    <Typography level="h6">{gameName}</Typography>
                </ListItem>
                <ListItem>
                    <Typography
                        level='h6'
                        id={`${game}-status`}
                        className={`status ${running === 'pinging' ? '' : running ? 'online' : 'offline'}`}
                        sx={{
                            width: '30%',
                            justifyContent: 'center',
                            color: running === 'pinging' ? '#eeb132' : (running ? '#6bb700' : '#ed3e42')
                        }}
                    >
                        {running === 'pinging' ? 'pinging' : running ? 'online' : 'offline'}
                    </Typography>
                </ListItem>
            </List>
            <Button
                id={`${game}-button`}
                loading={running === 'pinging'}
                sx={{ alignSelf: 'center', width: '20%' }}
                onClick={() => {
                    ws.send(JSON.stringify({ type: 'startStop', game: game }));
                }}
            >
                {running ? 'stop' : 'start'}
            </Button>
        </ListItem>
    );
}

export default function Home({ props }) {
    const session = useSession();
    const ws = new WebSocket('ws://localhost:443');
    const serverList = getServerList(ws);
    let runningList = {};
    serverList.forEach(function (game) {
        runningList[game] = 'pinging';
    });

    ws.onopen = function () {
        ws.send(JSON.stringify({type: 'username', username: session.data?.user?.name}));
    }

    // receive messages from server
    ws.onmessage = function (event) {
        // get data from message
        const data = JSON.parse(event.data);
        // if message is about server status, call update function
        switch (data.type) {
            case 'serverState':
                // updateStatuses(data);
                runningList[data.game] = data.running;
                // console.log(runningList);
                break;
            // commented out case below since it should be handled by getServerList(ws)
            // case 'serverList':
            //     addServer(data.name);
            //     break;
            // default:
            //     let console = document.getElementById('console');
            //     console.textContent += data;
            //     console.scrollTop = console.scrollHeight;
        }
    };

    return (
        <Layout page={'Home'} props={props} serverList={serverList}>
            <List id="server-list"
                  variant="outlined"
                  sx={{
                      // weird width but seems to work
                      // width: '95.5%',
                      width: '100%',
                      height: 'auto',
                      // mx: 4, // margin left & right
                      // my: 4, // margin top & bottom
                      py: 1, // padding top & bottom
                      px: 1, // padding left & right
                      borderRadius: 'sm',
                      boxShadow: 'sm',
                      flexGrow: 0,
                      display: 'inline-flex',
                      // justifyContent: 'space-between',
                      '--ListItemDecorator-size': '48px',
                      '--ListItem-paddingY': '1rem',
                }}>
                {serverList.map((game, index) => (
                    <Sheet key={game} sx={{ width: '100%' }}>
                        <ServerListItem game={game} ws={ws} running={runningList[game]} />
                        {index !== serverList.length - 1 && <ListDivider inset="gutter" />}
                    </Sheet>
                ))}
            </List>
            <Console ws={ws} game={undefined} />
        </Layout>
    );
}
