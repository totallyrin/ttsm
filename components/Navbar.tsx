import { Button, List, ListItem, Typography } from "@mui/joy";
import * as React from "react";
import { AccountCircleRounded, LogoutRounded } from "@mui/icons-material";
import { signOut } from "next-auth/react";

function LogoutButton() {
  const handleSignOut = () => {
    signOut({ callbackUrl: "/login" });
  };

  return (
    <Button
      variant="soft"
      startDecorator={<LogoutRounded />}
      onClick={handleSignOut}
    >
      Log out
    </Button>
  );
}

export default function Navbar({ username, onPageChange }) {
  return (
    <List
      orientation="horizontal"
      variant="outlined"
      sx={{
        width: "auto",
        mx: 4, // margin left & right
        my: 4, // margin top & bottom
        py: 1, // padding top & bottom
        px: 1, // padding left & right
        borderRadius: "sm",
        boxShadow: "sm",
        flexGrow: 0,
        display: "flex",
        justifyContent: "space-between",
        "--ListItemDecorator-size": "48px",
        "--ListItem-paddingY": "1rem",
      }}
    >
      <ListItem>
        <LogoutButton />
      </ListItem>
      <ListItem>
        <ListItem>
          <Typography level="h4" component="h1">
            {username !== "" ? `Welcome, ${username}!` : "Welcome!"}
          </Typography>
        </ListItem>
      </ListItem>
      <ListItem>
        <Button
          variant="soft"
          startDecorator={<AccountCircleRounded />}
          onClick={() => onPageChange("account")}
        >
          Account
        </Button>
      </ListItem>
    </List>
  );
}
