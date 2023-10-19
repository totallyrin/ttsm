import * as React from "react";
import { useEffect, useState } from "react";
import { Button, List, ListItem, Typography, useTheme } from "@mui/joy";
import { useMediaQuery } from "@mui/material";
import UpdateRoundedIcon from "@mui/icons-material/UpdateRounded";

export default function ServerVersion({
  url,
  game,
  running,
  auth,
}: {
  url: string;
  game: string;
  running: "pinging" | "updating" | boolean;
  auth: boolean;
}) {
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [loading, setLoading] = useState(false);
  const [version, setVersion] = useState("unknown");

  useEffect(() => {
    setLoading(false);
  }, [running]);

  return (
    <ListItem
      sx={{
        display: "flex",
        justifyContent: "space-between",
        minHeight: mobile ? "64px" : "80px", // ensures row height matches
      }}
    >
      <List
        orientation="horizontal"
        id={game}
        sx={{
          flex: 1,
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <ListItem
          sx={
            {
              // justifyContent: "center",
              // width: "30%",
            }
          }
        >
          <Typography
            level={mobile ? "title-sm" : "title-md"}
            sx={{ textAlign: "center" }}
          >
            {mobile ? `Version: ${version}` : `Current version: ${version}`}
          </Typography>
        </ListItem>
        <ListItem
          sx={{
            justifyContent: "center",
          }}
        >
          <Button
            // color="neutral"
            // variant="soft"
            size={mobile ? "sm" : "md"}
            id={`${game}-update`}
            loading={loading || running === "updating"}
            startDecorator={<UpdateRoundedIcon />}
            disabled={!auth || running === true || running === "pinging"}
            onClick={() => {
              setLoading(true);
              const ws = new WebSocket(url);
              ws.onopen = async () => {
                await ws.send(
                  JSON.stringify({
                    type: "update",
                    game: game,
                  }),
                );
                ws.close();
              };
            }}
          >
            Update
          </Button>
        </ListItem>
      </List>
    </ListItem>
  );
}
