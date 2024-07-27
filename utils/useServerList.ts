import { useEffect, useState } from "react";
import { url } from "./utils";

export interface ServerListItem {
  game: string;
  name: string;
  running: boolean;
}

export default function useServerList(): ServerListItem[] {
  const [serverList, setServerList] = useState<ServerListItem[]>([]);

  useEffect(() => {
    const websocket = new WebSocket(url);

    websocket.onopen = () => {
      console.log("WebSocket connection opened");
    };

    websocket.onmessage = function (message) {
      const data = JSON.parse(message.data);
      if (data.type === "serverList") {
        setServerList((currentList) => {
          if (currentList.some((server) => server.game === data.game)) {
            return currentList;
          }
          return [
            ...currentList,
            {
              game: data.game,
              name: data.name,
              running: data.running,
            },
          ];
        });
      }
    };

    // Clean up the WebSocket connection
    return () => {
      websocket.close();
    };
  }, [url]);

  return serverList;
}
