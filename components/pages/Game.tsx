import * as React from "react";
import { url } from "../../utils/utils";
import { List, Sheet } from "@mui/joy";
import Console from "../Console";
import ServerListItem from "../ServerListItem";
import Config from "../Config";

export default function Game({ theme, username, role, runningList, game }) {
  return (
    <Sheet
      sx={{
        display: "grid",
        gridTemplateColumns: "1fr",
        gridTemplateRows:
          role === ("owner" || "admin") ? "auto 1fr 1fr" : "auto 1fr",
        gridRowGap: theme.spacing(4),
      }}
    >
      <List
        id="server-list"
        variant="outlined"
        sx={{
          width: "100%",
          py: 1, // padding top & bottom
          px: 1, // padding left & right
          borderRadius: "sm",
          boxShadow: "sm",
          flexGrow: 0,
          display: "inline-flex",
          "--ListItemDecorator-size": "48px",
          "--ListItem-paddingY": "1rem",
        }}
      >
        <ServerListItem
          game={game}
          url={url}
          auth={role !== "no-auth"}
          running={runningList[game]}
        />
      </List>
      <Console role={role} game={game} />
      {role === ("owner" || "admin") && (
        <Config username={username} game={game} />
      )}
    </Sheet>
  );
}
