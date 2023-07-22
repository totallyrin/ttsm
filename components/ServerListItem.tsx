import * as React from "react";
import { useEffect, useState } from "react";
import { Button, List, ListItem, Typography } from "@mui/joy";
import { PlayArrowRounded, StopRounded } from "@mui/icons-material";

export default function ServerListItem({
  url,
  game,
  running,
  auth,
}: {
  url: string;
  game: string;
  running: "pinging" | boolean;
  auth: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const gameName =
    game === "pz"
      ? "Project Zomboid"
      : game.charAt(0).toUpperCase() + game.slice(1);

  useEffect(() => {
    setLoading(false);
  }, [running]);

  return (
    <ListItem sx={{ display: "flex", justifyContent: "space-between" }}>
      <List
        orientation="horizontal"
        id={game}
        sx={{
          flex: 1,
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <ListItem>
          <img
            src={`../img/${game}.png`}
            alt={game}
            style={{ width: "64px", height: "64px" }}
          />
        </ListItem>
        <ListItem
          sx={{
            justifyContent: "center",
            width: "30%",
          }}
        >
          <Typography level="h6" sx={{ textAlign: "center" }}>
            {gameName}
          </Typography>
        </ListItem>
        <ListItem
          sx={{
            justifyContent: "center",
          }}
        >
          <Typography
            level="h6"
            id={`${game}-status`}
            className={`status ${
              running === "pinging" ? "" : running ? "online" : "offline"
            }`}
            sx={{
              color:
                running === "pinging" || loading
                  ? "#eeb132"
                  : running
                  ? "#6bb700"
                  : "#ed3e42",
            }}
          >
            {running === "pinging" || loading
              ? "pinging"
              : running
              ? "online"
              : "offline"}
          </Typography>
        </ListItem>
        <ListItem
          sx={{
            justifyContent: "center",
          }}
        >
          <Button
            id={`${game}-button`}
            loading={running === "pinging" || loading}
            startDecorator={running ? <StopRounded /> : <PlayArrowRounded />}
            disabled={!auth}
            onClick={() => {
              setLoading(true);
              const ws = new WebSocket(url);
              ws.onopen = async () => {
                await ws.send(
                  JSON.stringify({
                    type: "startStop",
                    game: game,
                  }),
                );
                ws.close();
              };
            }}
          >
            {running ? "stop" : "start"}
          </Button>
        </ListItem>
      </List>
    </ListItem>
  );
}