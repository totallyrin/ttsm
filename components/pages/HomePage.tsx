import { List, ListDivider, Sheet } from "@mui/joy";
import { url } from "../../utils/utils";
import Console from "../Console";
import * as React from "react";
import ServerListItem from "../ServerListItem";

export default function HomePage({ theme, role, serverList, runningList }) {
  return (
    <Sheet
      sx={{
        display: "grid",
        gridTemplateColumns: "1fr",
        gridTemplateRows: "auto 1fr",
        gridRowGap: { xs: theme.spacing(2), md: theme.spacing(4) },
      }}
    >
      <List
        id="server-list"
        variant="outlined"
        sx={{
          width: "100%",
          py: 1,
          borderRadius: "sm",
          boxShadow: "sm",
          flexGrow: 0,
          display: "inline-flex",
        }}
      >
        {serverList.map((game, index) => (
          <Sheet key={game} sx={{ width: "100%" }}>
            <ServerListItem
              game={game}
              url={url}
              auth={role !== "no-auth"}
              running={runningList[game]}
            />
            {index !== serverList.length - 1 && <ListDivider inset="gutter" />}
          </Sheet>
        ))}
      </List>
      <Sheet>
        <Console role={role} game={undefined} />
      </Sheet>
    </Sheet>
  );
}
