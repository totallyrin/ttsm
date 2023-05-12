import { useEffect, useState } from 'react';
import {getSession, useSession} from 'next-auth/react';
import Head from 'next/head';
import {useTheme, Link, List, ListItem, Sheet, Typography, Button, ListDivider} from '@mui/joy';
import Layout from '../components/layout';
import useServerList from "../utils/useServerList";
import Console from "../components/console";
import { url } from '../utils/utils';
import * as React from "react";

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

    const username = session.user?.name ? session.user.name : '';

    return {
        props: {
            username: username,
        },
    };
}

function ServerListItem({ url, game, running }: { url: string, game: string, running: 'pinging' | boolean }) {
    const [loading, setLoading] = useState(false);
    const gameName = game === 'pz' ? 'Project Zomboid' : game.charAt(0).toUpperCase() + game.slice(1);

    useEffect(() => {
        setLoading(false);
    }, [running]);

    return (
        <ListItem sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <List orientation="horizontal" id={game} sx={{
                flex: 1,
                width: '100%',
                justifyContent: 'space-between'
            }}>
                <ListItem><img src={`../img/${game}.png`} alt={game} style={{width: '64px', height: '64px'}} /></ListItem>
                <ListItem sx={{
                    justifyContent: 'center',
                    width: '30%'
                }}><Typography level="h6" sx={{ textAlign: 'center' }}>{gameName}</Typography></ListItem>
                <ListItem sx={{
                    justifyContent: 'center',
                }}>
                    <Typography
                        level='h6'
                        id={`${game}-status`}
                        className={`status ${running === 'pinging' ? '' : running ? 'online' : 'offline'}`}
                        sx={{
                            color: running === 'pinging' || loading ? '#eeb132' : (running ? '#6bb700' : '#ed3e42')
                        }}
                    >
                        {running === 'pinging' || loading ? 'pinging' : running ? 'online' : 'offline'}
                    </Typography>
                </ListItem>
                <ListItem sx={{
                    justifyContent: 'center',
                }}>
                    <Button
                        id={`${game}-button`}
                        loading={running === 'pinging' || loading}
                        onClick={() => {
                            setLoading(true);
                            const ws = new WebSocket(url);
                            ws.onopen = async () => {
                                await ws.send(JSON.stringify({ type: 'startStop', game: game }));
                                ws.close();
                            };
                        }}
                    >
                        {running ? 'stop' : 'start'}
                    </Button>
                </ListItem>
            </List>
        </ListItem>
    );
}

export default function Home({ username }) {
    const [ws, setWs] = useState<WebSocket | null>(null);

    // open single websocket
    useEffect(() => {
        const websocket = (new WebSocket(url));
        setWs(websocket);

        websocket.onopen = () => {
            websocket.send(JSON.stringify({ type: 'username', username: username }));
        };
        // receive messages from server
        websocket.onmessage = function (message) {
            // get data from message
            const data = JSON.parse(message.data);
            // if message is about server status, update relevant status
            if (data.type === 'serverState') {
                setRunningList(prevRunningList => {
                    let temp = {...prevRunningList};
                    temp[data.game] = data.running;
                    return temp;
                });
            }
            if (data.type === 'debug') console.log(data.msg);
        };

        websocket.onclose = () => {
            console.log('websocket was closed');
        }
    }, []);

    const [serverList, setServerList] = useState<string[]>([]);
    const retrievedServers = useServerList();

    // get server list
    useEffect(() => {
        if (retrievedServers) setServerList(retrievedServers);
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

    const [page, setPage] = useState<JSX.Element>((
        <Layout username={username} page={'Home'} serverList={serverList}>
            <Sheet sx={{
                display: 'grid',
                gridTemplateColumns: 'auto',
                gridTemplateRows: 'auto',
                minHeight: '100%', // set min-height to ensure the layout takes up the full height of the viewport
                minWidth: 'fit-content',
            }}>
                <Typography level="h3">Loading...</Typography>
            </Sheet>
        </Layout>
    ));

    const theme = useTheme();

    useEffect(() => {
        setPage ((
            <Layout username={username} page={'Home'} serverList={serverList}>
                <Sheet sx={{
                    display: 'grid',
                    gridTemplateColumns: '1fr',
                    gridTemplateRows: 'auto 1fr',
                    gridRowGap: theme.spacing(4),
                }}>
                    <List id="server-list"
                          variant="outlined"
                          sx={{
                              width: '100%',
                              py: 1, // padding top & bottom
                              px: 1, // padding left & right
                              borderRadius: 'sm',
                              boxShadow: 'sm',
                              flexGrow: 0,
                              display: 'inline-flex',
                              '--ListItemDecorator-size': '48px',
                              '--ListItem-paddingY': '1rem',
                          }}>
                        {serverList.map((game, index) => (
                            <Sheet key={game} sx={{ width: '100%' }}>
                                <ServerListItem game={game} url={url} running={runningList[game]} />
                                {index !== serverList.length - 1 && <ListDivider inset="gutter" />}
                            </Sheet>
                        ))}
                    </List>
                    <Sheet><Console username={username} game={undefined} /></Sheet>
                </Sheet>
            </Layout>
        ));
    }, [ws, serverList, runningList]);

    return page;
}
