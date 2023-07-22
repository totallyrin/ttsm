import * as React from "react";
import { useEffect, useState } from "react";
import { url } from "../utils/utils";
import { Alert, Button, Sheet, Textarea, useTheme } from "@mui/joy";

export default function Config({ username, game }) {
  const [config, setConfig] = useState("");
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isError, setError] = useState(false);
  const [isSuccess, setSuccess] = useState(false);

  // open single websocket
  useEffect(() => {
    const ws = new WebSocket(url);
    setWs(ws);
    // receive messages from server
    ws.onmessage = function (event) {
      // get data from message
      const data = JSON.parse(event.data);
      if (data.type === "config") {
        if (data.game === game) {
          setConfig(data.content);
        }
      }
      if (data.type === "saveConfig") {
        if (data.success) {
          setSuccess(true);
        } else {
          setError(true);
        }
      }
    };
  }, [username]);

  const handleSave = (event) => {
    event.preventDefault();
    // send command to server
    if (ws) {
      ws.send(
        JSON.stringify({
          type: "config",
          game: game,
          content: config,
        }),
      );
    }
  };

  const handleInputChange = (event) => {
    setConfig(event.target.value);
    setError(false);
    setSuccess(false);
  };

  const theme = useTheme();

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
        gridTemplateRows: isError || isSuccess ? "auto 1fr auto" : "1fr auto",
        gridRowGap: theme.spacing(2),
        height: "100%",
      }}
    >
      {isError && (
        <Alert color="danger" variant="solid">
          An error occurred; server config not saved.
        </Alert>
      )}

      {isSuccess && (
        <Alert color="success" variant="solid">
          Server config saved!
        </Alert>
      )}

      <Sheet
        sx={{
          overflowY: "auto",
          height: "100%",
        }}
      >
        <Sheet
          sx={{
            maxHeight: "10px",
          }}
        >
          <Textarea
            variant="plain"
            name="config"
            value={config}
            onChange={handleInputChange}
            sx={{
              typography: "body3",
              height: "100%",
            }}
          />
        </Sheet>
      </Sheet>
      <Button
        type="submit"
        sx={{ width: "100%" }}
        onClick={(e) => {
          setError(false);
          setSuccess(false);
          handleSave(e);
        }}
      >
        Save
      </Button>
    </Sheet>
  );
}