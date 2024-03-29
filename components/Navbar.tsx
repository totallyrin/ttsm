import {
  Button,
  IconButton,
  List,
  ListItem,
  Sheet,
  Typography,
  useTheme,
} from "@mui/joy";
import * as React from "react";
import { AccountCircleRounded, LogoutRounded } from "@mui/icons-material";
import { signOut } from "next-auth/react";
import { useMediaQuery } from "@mui/material";

function LogoutButton({ mobile }: { mobile: boolean }) {
  const handleSignOut = () => {
    signOut({ callbackUrl: "/login" });
  };

  if (mobile)
    return (
      <IconButton
        color="neutral"
        variant="soft"
        onClick={handleSignOut}
        size={mobile ? "sm" : "md"}
      >
        <LogoutRounded />
      </IconButton>
    );
  else
    return (
      <Button
        color="neutral"
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
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Sheet
      variant="outlined"
      sx={{
        m: { xs: 2, md: 4 },
        px: { xs: 0.5, md: 1 },
        py: { xs: 1, md: 2 },
        borderRadius: "sm",
        boxShadow: "sm",
        width: "auto",
      }}
    >
      <List
        orientation="horizontal"
        sx={{
          width: "100%",
          flexGrow: 0,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <ListItem>
          <LogoutButton mobile={mobile} />
        </ListItem>
        <ListItem>
          <Typography sx={{ fontSize: { xs: "md", md: "lg" } }}>
            {username !== "" ? `Welcome, ${username}!` : "Welcome!"}
          </Typography>
        </ListItem>
        <ListItem>
          {mobile ? (
            <IconButton
              color="neutral"
              variant="soft"
              onClick={() => onPageChange("account")}
              size={mobile ? "sm" : "md"}
            >
              <AccountCircleRounded />
            </IconButton>
          ) : (
            <Button
              color="neutral"
              variant="soft"
              startDecorator={<AccountCircleRounded />}
              onClick={() => onPageChange("account")}
              size={mobile ? "sm" : "md"}
            >
              Account
            </Button>
          )}
        </ListItem>
      </List>
    </Sheet>
  );
}
