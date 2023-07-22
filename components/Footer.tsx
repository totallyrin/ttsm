import { Button, Link, List, ListItem, Typography } from "@mui/joy";
import { useColorScheme } from "@mui/joy/styles";
import * as React from "react";
import GitHubIcon from "@mui/icons-material/GitHub";
import { DarkModeRounded, LightModeRounded } from "@mui/icons-material";

function ModeToggle() {
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

  return (
    <Button
      variant="soft"
      startDecorator={
        mode === "light" ? <DarkModeRounded /> : <LightModeRounded />
      }
      onClick={() => {
        setMode(mode === "light" ? "dark" : "light");
      }}
    >
      {mode === "light" ? "Dark mode" : "Light mode"}
    </Button>
  );
}

export default function footer() {
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
        // position: 'fixed',
        // bottom: 0,
        justifyContent: "space-between",
        "--ListItemDecorator-size": "48px",
        "--ListItem-paddingY": "1rem",
      }}
    >
      <ListItem>
        <ModeToggle />
      </ListItem>
      <ListItem sx={{ alignSelf: "center" }}>
        <Typography level="body2" fontSize="sm" sx={{ alignSelf: "center" }}>
          Made by Lucy Woloszczuk
        </Typography>
      </ListItem>
      <ListItem>
        <Link href="https://github.com/totallyrin/ttsm">
          <Button
            variant="soft"
            // startDecorator={<KeyboardArrowLeft />}
            // endDecorator={<KeyboardArrowRight />}
            startDecorator={<GitHubIcon />}
          >
            Github
          </Button>
        </Link>
      </ListItem>
    </List>
  );
}
