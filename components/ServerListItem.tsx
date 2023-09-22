import * as React from "react";
import { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Chip,
  List,
  ListItem,
  Typography,
  useTheme,
} from "@mui/joy";
import {
  CancelRounded,
  CheckCircleRounded,
  PendingRounded,
  PlayArrowRounded,
  StopRounded,
} from "@mui/icons-material";
import { useMediaQuery } from "@mui/material";

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
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));
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
          {mobile ? (
            <Badge
              badgeContent={
                running === "pinging" || loading ? (
                  <PendingRounded
                    sx={{
                      my: 0.5,
                    }}
                  />
                ) : running ? (
                  <CheckCircleRounded
                    sx={{
                      my: 0.5,
                    }}
                  />
                ) : (
                  <CancelRounded
                    sx={{
                      my: 0.5,
                    }}
                  />
                )
              }
              color={
                running === "pinging" || loading
                  ? "warning"
                  : running
                  ? "success"
                  : "danger"
              }
              variant="plain"
              size="sm"
              badgeInset="5%"
              sx={{}}
            >
              <img
                src={`../img/${game}.png`}
                alt={game}
                style={{
                  width: mobile ? "48px" : "64px",
                  height: mobile ? "48px" : "64px",
                }}
              />
            </Badge>
          ) : (
            <img
              src={`../img/${game}.png`}
              alt={game}
              style={{
                width: mobile ? "48px" : "64px",
                height: mobile ? "48px" : "64px",
              }}
            />
          )}
        </ListItem>
        <ListItem
          sx={{
            justifyContent: "center",
            width: "30%",
          }}
        >
          <Typography
            level={mobile ? "title-sm" : "title-md"}
            sx={{ textAlign: "center" }}
          >
            {gameName}
          </Typography>
        </ListItem>
        {!mobile && (
          <ListItem
            sx={{
              justifyContent: "center",
            }}
          >
            <Chip
              variant="solid"
              id={`${game}-status`}
              color={
                running === "pinging" || loading
                  ? "warning"
                  : running
                  ? "success"
                  : "danger"
              }
              startDecorator={
                running === "pinging" || loading ? (
                  <PendingRounded />
                ) : running ? (
                  <CheckCircleRounded />
                ) : (
                  <CancelRounded />
                )
              }
            >
              {running === "pinging" || loading
                ? "pinging"
                : running
                ? "online"
                : "offline"}
            </Chip>
          </ListItem>
        )}
        <ListItem
          sx={{
            justifyContent: "center",
          }}
        >
          <Button
            // color="neutral"
            // variant="soft"
            size={mobile ? "sm" : "md"}
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
