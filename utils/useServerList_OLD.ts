import {useEffect, useMemo, useState} from "react";

export default function useServerList_OLD(ws: WebSocket) {
    const [serverList, setServerList] = useState<string[]>([]);

    ws.onopen = function () {
        ws.send(JSON.stringify({type: 'serverList'}));
    }

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

    return serverList;
}
