import {useRouter} from 'next/router'
import * as React from "react";
import {useEffect, useState} from "react";
import {url} from "../../utils/utils";
import useServerList from "../../utils/useServerList";
import Layout from "../../components/layout";
import {Alert, Button, List, ListItem, Sheet, Textarea, Typography, useTheme} from "@mui/joy";
import Console from "../../components/console";
import {getSession} from "next-auth/react";

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
    // @ts-ignore
    const role = session.role;

    return {
        props: {
            username: username,
            role: role
        },
    };
}

function ServerListItem({url, game, running}: { url: string, game: string, running: 'pinging' | boolean }) {
    const [loading, setLoading] = useState(false);
    const gameName = game === 'pz' ? 'Project Zomboid' : game.charAt(0).toUpperCase() + game.slice(1);

    useEffect(() => {
        setLoading(false);
    }, [running]);

    return (
        <ListItem sx={{display: 'flex', justifyContent: 'space-between'}}>
            <List orientation="horizontal" id={game} sx={{
                flex: 1,
                width: '100%',
                justifyContent: 'space-between'
            }}>
                <ListItem><img src={`../img/${game}.png`} alt={game}
                               style={{width: '64px', height: '64px'}}/></ListItem>
                <ListItem sx={{
                    justifyContent: 'center',
                    width: '30%'
                }}><Typography level="h6">{gameName}</Typography></ListItem>
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
                                await ws.send(JSON.stringify({type: 'startStop', game: game}));
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

function Config({username, game}) {
    const [config, setConfig] = useState('');
    const [ws, setWs] = useState<WebSocket | null>(null);
    const [isError, setError] = useState(false);
    const [isSuccess, setSuccess] = useState(false);

    // open single websocket
    useEffect(() => {
        const ws = new WebSocket(url);
        setWs(ws);
        // receive messages from server
        ws.onmessage = function (event) {
            // get data from message
            const data = JSON.parse(event.data);
            if (data.type === 'config') {
                if (data.game === game) {
                    setConfig(data.content);
                }
            }
            if (data.type === 'saveConfig') {
                if (data.success) {
                    setSuccess(true);
                } else {
                    setError(true);
                }
            }
        };
    }, [username]);

    const handleSave = (event) => {
        event.preventDefault();
        // send command to server
        if (ws) {
            ws.send(JSON.stringify({type: 'config', game: game, content: config}));
        }
    };

    const handleInputChange = (event) => {
        setConfig(event.target.value);
        setError(false);
        setSuccess(false);
    };

    const theme = useTheme();

    return (
        <Sheet variant="outlined" sx={{
            p: 2,
            borderRadius: 'sm',
            boxShadow: 'sm',
            overflowY: 'auto',
            display: 'grid',
            gridTemplateColumns: 'auto',
            gridTemplateRows: (isError || isSuccess ? 'auto 1fr auto' : '1fr auto'),
            gridRowGap: theme.spacing(2),
            height: '100%',
        }}>
            {isError && (<Alert color="danger" variant="solid">
                An error occurred; server config not saved.
            </Alert>)}

            {isSuccess && (<Alert color="success" variant="solid">
                Server config saved!
            </Alert>)}

            <Sheet sx={{
                overflowY: 'auto',
                height: '100%',
            }}>
                <Sheet
                    sx={{
                        maxHeight: '10px',
                    }}>
                    <Textarea
                        variant="plain"
                        name="config"
                        value={config}
                        onChange={handleInputChange}
                        sx={{
                            typography: 'body3',
                            height: '100%'
                        }}
                    />
                </Sheet>
            </Sheet>
            <Button
                type="submit"
                sx={{width: '100%'}}
                onClick={(e) => {
                    setError(false);
                    setSuccess(false);
                    handleSave(e);
                }}
            >Save</Button>
        </Sheet>
    );
}

export default function Game({username, role}) {
    const router = useRouter()
    const {game} = router.query

    const [ws, setWs] = useState<WebSocket | null>(null);

    // open single websocket
    useEffect(() => {
        const websocket = (new WebSocket(url));
        setWs(websocket);

        websocket.onopen = () => {
            websocket.send(JSON.stringify({type: 'username', username: username}));
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
        <Layout username={username} role={role} page={'Home'} serverList={serverList}>
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
        // @ts-ignore
        setPage((
            <Layout username={username} role={role} page={`Config`} serverList={serverList}>
                <Sheet sx={{
                    display: 'grid',
                    gridTemplateColumns: '1fr',
                    gridTemplateRows: 'auto 1fr 1fr',
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
                        {/*// @ts-ignore*/}
                        <ServerListItem game={game} url={url} running={runningList[game]}/>
                    </List>
                    <Console username={username} game={game}/>
                    <Config username={username} game={game}/>
                </Sheet>
            </Layout>
        ));
    }, [ws, serverList, runningList]);

    return page;
}