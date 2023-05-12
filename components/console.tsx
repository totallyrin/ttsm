import { useState, useEffect, useRef } from 'react';
import {Input, Sheet, TextField, Typography, useTheme} from "@mui/joy";
import { url } from '../utils/utils';

export default function Console({ username, game }) {
    const [logs, setLogs] = useState<string[]>([]);
    const sheetRef = useRef(null);

    useEffect(() => {
        // scroll to bottom of console when a new log is added
        if (sheetRef.current) {
            sheetRef.current.scrollTop = sheetRef.current.scrollHeight;
        }
    }, [logs]);

    const [ws, setWs] = useState<WebSocket | null>(null);

    // open single websocket
    useEffect(() => {
        const ws = new WebSocket(url);
        setWs(ws);
        // receive messages from server
        ws.onmessage = function (event) {
            // get data from message
            const data = JSON.parse(event.data);
            // if message doesn't have a type
            if (data.type === 'console') {
                if (game) {
                    game = game === 'pz' ? 'PZ' : game.charAt(0).toUpperCase() + game.slice(1);
                    if (data.data.startsWith(`${game} server:`)) {
                        // append to console
                        setLogs(prevLogs => {
                            let temp = [...prevLogs];
                            temp.push(data.data);
                            return temp;
                        });
                    }
                }
                else {
                    // append to console
                    setLogs(prevLogs => {
                        let temp = [...prevLogs];
                        temp.push(data.data);
                        return temp;
                    });
                }
            }
        };
    }, [username]);

    const [command, setCommand] = useState('');
    const sendConsoleCommand = (event) => {
        setCommand(event.target.value);
    };
    const sendCommand = (event) => {
        event.preventDefault();
        // send command to server
        // ...
        if (ws) {
            ws.send(JSON.stringify({ type: 'command', game: game, command: command }));
        }
        setCommand('');
    };

    // TODO: figure out why console grows infinitely, and doesn't scroll
    return (
        <Sheet variant="outlined" sx={{
            p: 2,
            borderRadius: 'sm',
            boxShadow: 'sm',
            overflowY: 'auto',
            display: 'grid',
            gridTemplateColumns: 'auto',
            gridTemplateRows: '1fr auto',
            height: 'calc(100%)',
        }}>
            <Sheet sx={{ height: '100%', overflow: 'auto' }}>
                {logs.map((log, index) => (
                    <Typography key={index} level="body3">{log}</Typography>
                ))}
            </Sheet>
            {game && (
                <form onSubmit={sendCommand}>
                    <Input value={command} onChange={sendConsoleCommand} sx={{
                        mt: 2,
                    }} />
                </form>
            )}
        </Sheet>
    );
}
