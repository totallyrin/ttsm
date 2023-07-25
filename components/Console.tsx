import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { Input, Sheet, Typography } from "@mui/joy";
import { url } from "../utils/utils";

export default function Console({ role, game }) {
  const [logs, setLogs] = useState<string[]>([
    // 'TTSM: Console loaded',
  ]);
  const sheetRef = useRef<null | any>(null);

  useEffect(() => {
    // scroll to bottom of console when a new log is added
    if (sheetRef.current) {
      sheetRef.current.scrollTop = sheetRef.current.scrollHeight;
    }
  }, [logs]);

  const [ws, setWs] = useState<WebSocket | null>(null);

  // open single websocket
  useEffect(() => {
    setLogs(["Loading..."]);
    const ws = new WebSocket(url);
    setWs(ws);
    ws.onopen = () => {
      setLogs([]);
    };
    // receive messages from server
    ws.onmessage = function (event) {
      // get data from message
      const data = JSON.parse(event.data);
      // if message doesn't have a type
      if (data.type === "console") {
        if (game) {
          game =
            game === "pz" ? "PZ" : game.charAt(0).toUpperCase() + game.slice(1);
          if (data.data.startsWith(`${game} server:`)) {
            // append to console
            setLogs((prevLogs) => {
              let temp = [...prevLogs];
              temp.push(data.data);
              return temp;
            });
          }
        } else {
          // append to console
          setLogs((prevLogs) => {
            let temp = [...prevLogs];
            temp.push(data.data);
            return temp;
          });
        }
      }
    };
  }, [game]);

  const [command, setCommand] = useState("");
  const sendConsoleCommand = (event) => {
    setCommand(event.target.value);
  };
  const sendCommand = (event) => {
    event.preventDefault();
    // send command to server
    if (ws) {
      ws.send(
        JSON.stringify({ type: "command", game: game, command: command }),
      );
    }
    setCommand("");
  };

  return (
    <Sheet
      variant="outlined"
      sx={{
        p: 2,
        borderRadius: "sm",
        boxShadow: "sm",
        overflowY: "auto",
        display: "grid",
        gridTemplateColumns: "auto",
        gridTemplateRows: "1fr auto",
        height: "100%",
      }}
    >
      <Sheet
        ref={sheetRef}
        sx={{
          px: 1,
          overflowY: "auto",
          height: "100%",
        }}
      >
        <Sheet sx={{ maxHeight: "10px", pb: 4 }}>
          {logs.map((log, index) => (
            <Typography key={index} level="body3">
              {role === "no-auth"
                ? "Console disabled; user" + " not approved"
                : log}
            </Typography>
          ))}
        </Sheet>
      </Sheet>
      {game && role === "admin" && (
        <form onSubmit={sendCommand}>
          <Input
            value={command}
            onChange={sendConsoleCommand}
            sx={{
              mt: 2,
              typography: "body3",
            }}
          />
        </form>
      )}
    </Sheet>
  );
}
