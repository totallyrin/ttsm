import {useEffect, useState} from "react";

export default function getServerList(ws: WebSocket) {
    const [serverList, setServerList] = useState<string[]>([]);

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

    return serverList;
}
