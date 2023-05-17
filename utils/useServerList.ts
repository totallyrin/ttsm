import { useEffect, useState } from "react";
import { url } from "./utils";

export default function useServerList(): string[] {
  const [serverList, setServerList] = useState<string[]>([]);

  useEffect(() => {
    const websocket = new WebSocket(url);

    websocket.onopen = () => {
      console.log("WebSocket connection opened");
    };

    websocket.onmessage = function (message) {
      const data = JSON.parse(message.data);
      if (data.type === "serverList") {
        setServerList((currentList) => {
          if (currentList.includes(data.name)) {
            return currentList;
          }
          return [...currentList, data.name];
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
