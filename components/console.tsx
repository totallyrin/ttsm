import { useState, useEffect } from 'react';
import {Sheet, Typography} from "@mui/joy";
import { url } from '../utils/utils';

export default function Console({ username, game }) {
    const [logs, setLogs] = useState<string[]>([]);

    useEffect(() => {
        // scroll to bottom of console when a new log is added
        const consoleDiv = document.getElementById('console');
        if (consoleDiv) consoleDiv.scrollTop = consoleDiv.scrollHeight;
    }, [logs]);

    // open single websocket
    useEffect(() => {
        const ws = new WebSocket(url);
        // receive messages from server
        ws.onmessage = function (event) {
            // get data from message
            const data = JSON.parse(event.data);
            // if message doesn't have a type
            if (typeof data === "string") {
                // append to console
                setLogs(prevLogs => {
                    let temp = {...prevLogs};
                    temp.push(data);
                    return temp;
                });
            }
        };
    }, [username]);

    return (
        <Sheet variant="outlined" sx={{
            mt: 4,
            borderRadius: 'sm',
            boxShadow: 'sm',
            height: '100%'
        }}>
            <div id="console" style={{ height: '100%', overflowY: 'scroll' }}>
                {logs.map((log, index) => (
                    <Typography key={index} level="body1">{log}</Typography>
                ))}
            </div>
        </Sheet>
    );
}
