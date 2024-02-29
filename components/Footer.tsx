import {
  Button,
  IconButton,
  Link,
  List,
  ListItem,
  Sheet,
  Typography,
  useTheme,
} from "@mui/joy";
import { useColorScheme } from "@mui/joy/styles";
import * as React from "react";
import GitHubIcon from "@mui/icons-material/GitHub";
import { DarkModeRounded, LightModeRounded } from "@mui/icons-material";
import { useMediaQuery } from "@mui/material";

function ModeToggle({ mobile }: { mobile: boolean }) {
  const { mode, setMode } = useColorScheme();
  const [mounted, setMounted] = React.useState(false);

  // necessary for server-side rendering
  // because mode is undefined on the server
  React.useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return null;
  }

  if (mobile)
    return (
      <IconButton
        color="neutral"
        variant="soft"
        onClick={() => {
          setMode(mode === "light" ? "dark" : "light");
        }}
        size={mobile ? "sm" : "md"}
      >
        {mode === "light" ? <DarkModeRounded /> : <LightModeRounded />}
      </IconButton>
    );
  else
    return (
      <Button
        color="neutral"
        variant="soft"
        startDecorator={
          mode === "light" ? <DarkModeRounded /> : <LightModeRounded />
        }
        onClick={() => {
          setMode(mode === "light" ? "dark" : "light");
        }}
        size={mobile ? "sm" : "md"}
      >
        {mode === "light" ? "Dark mode" : "Light mode"}
      </Button>
    );
}

export default function footer() {
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
          width: "auto",
          flexGrow: 0,
          display: "flex",
          // position: 'fixed',
          // bottom: 0,
          justifyContent: "space-between",
        }}
      >
        <ListItem>
          <ModeToggle mobile={mobile} />
        </ListItem>
        <ListItem sx={{ alignSelf: "center" }}>
          <Typography
            sx={{
              alignSelf: "center",
              fontSize: { xs: "xs", md: "sm" },
            }}
          >
            Made by totallyrin
          </Typography>
        </ListItem>
        <ListItem>
          <Link href="https://github.com/totallyrin/ttsm">
            {mobile ? (
              <IconButton
                color="neutral"
                variant="soft"
                size={mobile ? "sm" : "md"}
              >
                <GitHubIcon />
              </IconButton>
            ) : (
              <Button
                color="neutral"
                variant="soft"
                size={mobile ? "sm" : "md"}
                startDecorator={<GitHubIcon />}
              >
                Github
              </Button>
            )}
          </Link>
        </ListItem>
      </List>
    </Sheet>
  );
}
