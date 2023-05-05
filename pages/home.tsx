import { useEffect, useState } from 'react';
import Head from 'next/head';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { CssBaseline, CssVarsProvider, Link, List, ListItem, Sheet, Typography, Button } from '@mui/joy';

function ServerListItem({ ws, game }: { ws: WebSocket, game: string }) {
    const [running, setRunning] = useState<'pinging' | boolean>('pinging');

    useEffect(() => {
        // const ws = new WebSocket('ws://localhost:443');

        ws.onopen = function () {
            const username = localStorage.getItem('username');
            ws.send(JSON.stringify({ type: 'username', username: username }));
        };

        ws.onmessage = function (event: any) {
            const data = JSON.parse(event.data);
            if (data.type === 'serverState' && data.game === game) {
                setRunning(data.running);
            }
        };

        // ws.send(JSON.stringify({ type: 'getState', game: game }));

        return () => {
            ws.close();
        };
    }, [game]);

    const gameName = game === 'pz' ? 'Project Zomboid' : game.charAt(0).toUpperCase() + game.slice(1);

    return (
        <ListItem
            sx={{
                display: 'block',
                flexDirection: 'row',
                alignItems: 'center',
            }}
        >
            <div id={game} className="games">
                <img src={`../img/${game}.png`} alt={game}/>
                <Link href={`./server-config.html?game=${game}`} className="server-link" data-game={game}>
                    {gameName}
                </Link>
                <Typography id={`${game}-status`} className={`status ${running === 'pinging' ? '' : running ? 'online' : 'offline'}`}>
                    {running === 'pinging' ? 'pinging' : running ? 'online' : 'offline'}
                </Typography>
                <Button id={`${game}-button`} disabled={running === 'pinging'}>
                    {running ? 'stop' : 'start'}
                </Button>
            </div>
        </ListItem>
    );
}

export default function Home() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState<string>('');
    const [serverList, setServerList] = useState<string[]>([]);
    const ws = new WebSocket('ws://localhost:443');

    useEffect(() => {
        setIsLoggedIn(!!localStorage.getItem('isLoggedIn'));
        setUsername(localStorage.getItem('username') ?? '');
    }, []);

    useEffect(() => {

        ws.onopen = function () {
            const username = localStorage.getItem('username');
            ws.send(JSON.stringify({ type: 'username', username: username }));
        };

        ws.onmessage = function (event: any) {
            const data = JSON.parse(event.data);
            if (data.type === 'serverList') {
                setServerList((currentList) => {
                    if (currentList.includes(data.name)) {
                        return currentList;
                    }
                    return [...currentList, data.name];
                });
            }
        };
    }, []);

    return (
        <CssBaseline>
            <CssVarsProvider defaultMode="system">
                <Head>
                    <meta charSet="UTF-8" />
                    <title>SERVER CONTROLLER</title>
                    <link rel="stylesheet" href="../styles/style.css" />
                </Head>

                <Navbar username={username} />

                <Sheet
                    variant="outlined"
                    sx={{
                        width: "auto",
                        mx: 4, // margin left & right
                        my: 4, // margin top & bottom
                        py: 3, // padding top & bottom
                        px: 3, // padding left & right
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        borderRadius: "sm",
                        boxShadow: "md",
                    }}
                >
                    <main>
                        <List id="server-list">
                            {serverList.map((game) => (
                                <ServerListItem key={game} game={game} ws={ws}/>
                            ))}
                        </List>
                    </main>
                </Sheet>

                <Footer />
            </CssVarsProvider>
        </CssBaseline>
    );
}
