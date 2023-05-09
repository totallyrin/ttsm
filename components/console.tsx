import { useState, useEffect } from 'react';
import {Sheet, Typography} from "@mui/joy";

export default function Console({ ws, game }) {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        // scroll to bottom of console when a new log is added
        const consoleDiv = document.getElementById('console');
        consoleDiv.scrollTop = consoleDiv.scrollHeight;
    }, [logs]);

    // receive messages from server
    ws.onmessage = function (event) {
        // get data from message
        const data = JSON.parse(event.data);
        // if message is about server status, call update function
        if (data.type !== 'serverState' && data.type !== 'serverList') {
            // append to console
            if (game && data.game === game) {
                // if game is specified, then only log that game's console
                setLogs(logs => [...logs, data.console]);
            }
            else {
                // if no game specified, log all consoles
                setLogs(logs => [...logs, data.game + ': ' + data.console]);
            }
        }
    };

    return (
        <Sheet variant="outlined" sx={{
            mt: 4,
            borderRadius: 'sm',
            boxShadow: 'sm',
            height: '100%',
        }}>
            <div id="console" style={{ height: '300px', overflowY: 'scroll' }}>
                {logs.map((log, index) => (
                    <Typography key={index} level="body1">{log}</Typography>
                ))}
            </div>
        </Sheet>
    );
}
