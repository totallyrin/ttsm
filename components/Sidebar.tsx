import * as React from "react";
import { useState } from "react";
import { Button, List, ListItem, Typography } from "@mui/joy";
import {
  AdminPanelSettingsRounded,
  HomeRounded,
  KeyboardArrowDown,
  StackedLineChartRounded,
} from "@mui/icons-material";

function ServerListItem({ game, onPageChange }) {
  const gameName =
    game === "pz"
      ? "Project Zomboid"
      : game.charAt(0).toUpperCase() + game.slice(1);

  return (
    <ListItem nested>
      <Button
        variant="plain"
        startDecorator={
          <img
            src={`../img/${game}.png`}
            alt={game}
            style={{ width: "24px", height: "24px" }}
          />
        }
        onClick={() => onPageChange(`servers/${game}`)}
        sx={{ width: "100%", justifyContent: "flex-start" }}
      >
        <Typography
          level="body3"
          sx={{ textTransform: "uppercase", textAlign: "left" }}
        >
          {gameName}
        </Typography>
      </Button>
    </ListItem>
  );
}

export default function Sidebar({ role, serverList, onPageChange }) {
  const [serversOpen, setServersOpen] = useState(false);

  return (
    <List
      variant="outlined"
      sx={{
        mr: 4,
        py: 1, // padding top & bottom
        px: 1, // padding left & right
        borderRadius: "sm",
        boxShadow: "sm",
        flexGrow: 0,
        display: "inline-flex",
        flexDirection: "column",
        "--ListItemDecorator-size": "48px",
      }}
    >
      <ListItem>
        <Typography
          level="body3"
          // startDecorator={<Code />}
          sx={{ textTransform: "uppercase", width: "100%" }}
        >
          TTSM - Totally Terrible Server Manager
        </Typography>
      </ListItem>
      <ListItem sx={{ width: "100%" }}>
        <Button
          variant="plain"
          startDecorator={<HomeRounded />}
          onClick={() => onPageChange("home")}
          sx={{ width: "100%", justifyContent: "flex-start" }}
        >
          <Typography level="body3" sx={{ textTransform: "uppercase" }}>
            Home
          </Typography>
        </Button>
      </ListItem>
      {role === ("owner" || "admin") && (
        <ListItem sx={{ width: "100%" }}>
          <Button
            variant="plain"
            startDecorator={<AdminPanelSettingsRounded />}
            onClick={() => onPageChange("admin")}
            sx={{ width: "100%", justifyContent: "flex-start" }}
          >
            <Typography level="body3" sx={{ textTransform: "uppercase" }}>
              Admin
            </Typography>
          </Button>
        </ListItem>
      )}
      <ListItem>
        <Button
          variant="plain"
          startDecorator={<StackedLineChartRounded />}
          onClick={() => onPageChange("system")}
          sx={{ width: "100%", justifyContent: "flex-start" }}
        >
          <Typography level="body3" sx={{ textTransform: "uppercase" }}>
            System
          </Typography>
        </Button>
      </ListItem>
      <ListItem>
        <Button
          variant="plain"
          startDecorator={
            <KeyboardArrowDown
              sx={{ transform: serversOpen ? "initial" : "rotate(-90deg)" }}
            />
          }
          sx={{ width: "100%", justifyContent: "flex-start" }}
          onClick={() => setServersOpen(!serversOpen)}
        >
          <Typography
            level="body3"
            sx={{
              textTransform: "uppercase",
              fontWeight: serversOpen ? "bold" : undefined,
              color: serversOpen ? "inherit" : "",
            }}
          >
            Servers
          </Typography>
        </Button>
      </ListItem>
      {serversOpen && (
        <ListItem>
          <List
            sx={{
              py: 0,
            }}
          >
            {serverList.map((game) => (
              <ServerListItem game={game} onPageChange={onPageChange} />
            ))}
          </List>
        </ListItem>
      )}
    </List>
  );
}
