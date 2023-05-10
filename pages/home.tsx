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
    const [username, setUsername] = useState<string>('');
    // setup username updates
    useEffect(() => {
        if (session.data && session.data.user && session.data.user.name) {
            setUsername(session.data.user.name);
        }
    }, [session]);

    const [ws, setWs] = useState<WebSocket>(new WebSocket('ws://localhost:443'));
    // initialize websocket
    useEffect(() => {
        const newWebSocket = new WebSocket('ws://localhost:443');
        setWs(newWebSocket);

        return () => {
            newWebSocket.close();
        };
    }, []);

    // open websocket connection when the username changes
    useEffect(() => {
        if (ws) {
            ws.onopen = () => {
                ws.send(JSON.stringify({ type: 'username', username: username }));
            };
        }
    }, [ws, username]);

    const [serverList, setServerList] = useState<string[]>([]);
    let retrievedServers = getServerList(ws);
    // get server list
    useEffect(() => {
        setServerList(retrievedServers);
    }, [retrievedServers]);

    const [runningList, setRunningList] = useState({});
    // initialize server statuses
    useEffect(() => {
        if (serverList) {
            let temp = {};
            serverList.forEach(function (game) {
                temp[game] = 'pinging';
            });
            setRunningList(temp);
        }
    }, [serverList]);

    useEffect(() => {
        if (ws) {
            // receive messages from server
            ws.onmessage = function (event) {
                // get data from message
                const data = JSON.parse(event.data);
                // if message is about server status, update relevant status
                if (data.type === 'serverState') {
                    let temp = {...runningList};
                    temp[data.game] = data.running;
                    setRunningList(temp);
                }
            };
        }
    }, [ws]);

    // // receive messages from server
    // ws.onmessage = function (event) {
    //     console.log('message received');
    //     // get data from message
    //     const data = JSON.parse(event.data);
    //     // if message is about server status, update relevant status
    //     if (data.type === 'serverState') {
    //         console.log(`${data.game} : ${data.running}`);
    //         let temp = {...runningList};
    //         console.log(temp);
    //         temp[data.game] = data.running;
    //         console.log(temp);
    //         setRunningList(temp);
    //     }
    // };

    const [page, setPage] = useState<JSX.Element>((
        <Layout username={username} page={'Home'} props={props} serverList={serverList}>
            <Typography level="h3">Loading...</Typography>
        </Layout>
    ));

    useEffect(() => {
        setPage ((
            <Layout username={username} page={'Home'} props={props} serverList={serverList}>
                <Sheet sx={{
                    display: 'grid',
                    gridTemplateColumns: 'auto',
                    gridTemplateRows: 'auto 1fr',
                    minHeight: '100%', // set min-height to ensure the layout takes up the full height of the viewport
                    minWidth: 'fit-content',
                }}>
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
                    {/*<Console ws={ws} game={undefined} />*/}
                </Sheet>
            </Layout>
        ));
    }, [ws, serverList, runningList]);
    // return (
    //     <Layout username={username} page={'Home'} props={props} serverList={serverList}>
    //         <Sheet sx={{
    //             display: 'grid',
    //             gridTemplateColumns: 'auto',
    //             gridTemplateRows: 'auto 1fr',
    //             minHeight: '100%', // set min-height to ensure the layout takes up the full height of the viewport
    //             minWidth: 'fit-content',
    //         }}>
    //             <List id="server-list"
    //                   variant="outlined"
    //                   sx={{
    //                       // weird width but seems to work
    //                       // width: '95.5%',
    //                       width: '100%',
    //                       height: 'auto',
    //                       // mx: 4, // margin left & right
    //                       // my: 4, // margin top & bottom
    //                       py: 1, // padding top & bottom
    //                       px: 1, // padding left & right
    //                       borderRadius: 'sm',
    //                       boxShadow: 'sm',
    //                       flexGrow: 0,
    //                       display: 'inline-flex',
    //                       // justifyContent: 'space-between',
    //                       '--ListItemDecorator-size': '48px',
    //                       '--ListItem-paddingY': '1rem',
    //                 }}>
    //                 {serverList.map((game, index) => (
    //                     <Sheet key={game} sx={{ width: '100%' }}>
    //                         <ServerListItem game={game} ws={ws} running={runningList[game]} />
    //                         {index !== serverList.length - 1 && <ListDivider inset="gutter" />}
    //                     </Sheet>
    //                 ))}
    //             </List>
    //             {/*<Console ws={ws} game={undefined} />*/}
    //         </Sheet>
    //     </Layout>
    // );

    return page;
}
