import * as React from "react";
import { url } from "../../utils/utils";
import { Box, List, ListDivider, Sheet } from "@mui/joy";
import Console from "../Console";
import ServerListItem from "../ServerListItem";
import Config from "../Config";
import ServerVersion from "../ServerVersion";

export default function Game({ theme, username, role, runningList, game }) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "1fr",
        gridTemplateRows:
          role === ("owner" || "admin") ? "auto 1fr 1fr" : "auto 1fr",
        gridRowGap: { xs: theme.spacing(2), md: theme.spacing(4) },
      }}
    >
      <Sheet
        variant="outlined"
        sx={{
          borderRadius: "sm",
          boxShadow: "sm",
        }}
      >
        <List
          id="server-list"
          sx={{
            width: "100%",
            flexGrow: 0,
            display: "inline-flex",
          }}
        >
          <ServerListItem
            game={game}
            url={url}
            auth={role !== "no-auth"}
            running={runningList[game]}
          />
          <ListDivider inset="gutter" />
          <ServerVersion
            url={url}
            game={game}
            running={runningList[game]}
            auth={role === "admin" || role === "owner"}
          />
        </List>
      </Sheet>
      <Console role={role} game={game} />
      {role === ("owner" || "admin") && (
        <Config username={username} game={game} />
      )}
    </Box>
  );
}
