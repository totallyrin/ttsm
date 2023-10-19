import { Box, List, ListDivider, Sheet } from "@mui/joy";
import { url } from "../../utils/utils";
import Console from "../Console";
import * as React from "react";
import ServerListItem from "../ServerListItem";

export default function HomePage({ theme, role, serverList, runningList }) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "1fr",
        gridTemplateRows: "auto 1fr",
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
            py: 1,
            flexGrow: 0,
            display: "inline-flex",
            width: "100%",
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
              {index !== serverList.length - 1 && (
                <ListDivider inset="gutter" />
              )}
            </Sheet>
          ))}
        </List>
      </Sheet>
      <Box>
        <Console role={role} game={undefined} />
      </Box>
    </Box>
  );
}
