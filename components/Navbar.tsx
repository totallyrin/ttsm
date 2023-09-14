import { Button, List, ListItem, Typography, useTheme } from "@mui/joy";
import * as React from "react";
import { AccountCircleRounded, LogoutRounded } from "@mui/icons-material";
import { signOut } from "next-auth/react";
import { useMediaQuery } from "@mui/material";

function LogoutButton({ mobile }: { mobile: boolean }) {
  const handleSignOut = () => {
    signOut({ callbackUrl: "/login" });
  };

  return (
    <Button
      size={mobile ? "sm" : "md"}
      variant="soft"
      startDecorator={<LogoutRounded />}
      onClick={handleSignOut}
    >
      Log out
    </Button>
  );
}

export default function Navbar({ username, onPageChange }) {
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.up("xs"));

  return (
    <List
      orientation="horizontal"
      variant="outlined"
      sx={{
        width: "auto",
        mx: { xs: 2, s: 3, md: 4 }, // margin left & right
        my: { xs: 2, s: 3, md: 4 }, // margin top & bottom
        py: { xs: 0.25, s: 0.5, md: 1 }, // padding top & bottom
        px: { xs: 0.25, s: 0.5, md: 1 }, // padding left & right
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
        <LogoutButton mobile={mobile} />
      </ListItem>
      <ListItem>
        <Typography sx={{ fontSize: { xs: "h6", xl: "h1" } }}>
          {username !== "" ? `Welcome, ${username}!` : "Welcome!"}
        </Typography>
      </ListItem>
      <ListItem>
        <Button
          variant="soft"
          startDecorator={<AccountCircleRounded />}
          onClick={() => onPageChange("account")}
          size={mobile ? "sm" : "md"}
        >
          Account
        </Button>
      </ListItem>
    </List>
  );
}
