import { useState, useEffect, useRef } from 'react';
import {Sheet, Typography} from "@mui/joy";
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

    // useEffect(() => {
    //     // scroll to bottom of console when a new log is added
    //     const consoleDiv = document.getElementById('console');
    //     if (consoleDiv) consoleDiv.scrollTop = consoleDiv.scrollHeight;
    // }, [logs]);

    // open single websocket
    useEffect(() => {
        const ws = new WebSocket(url);
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

    return (
        <Sheet variant="outlined" sx={{
            p: 2,
            borderRadius: 'sm',
            boxShadow: 'sm',
            height: '100%',
            overflowY: 'scroll',
        }}>
            {logs.map((log, index) => (
                <Typography key={index} level="body3">{log}</Typography>
            ))}
        </Sheet>
    );
}
