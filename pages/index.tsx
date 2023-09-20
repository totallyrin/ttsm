import Footer from "../components/Footer";
import Head from "next/head";
import {
  Button,
  CssBaseline,
  CssVarsProvider,
  Link,
  List,
  ListItem,
  Sheet,
  Typography,
} from "@mui/joy";
import * as React from "react";

function Content() {
  return (
    <Sheet sx={{ p: { xs: 2, md: 4 } }}>
      <Sheet
        sx={{
          textAlign: "center",
          my: { xs: 1, md: 2 },
          width: "100%",
        }}
      >
        <Typography level="h2">Welcome to TTSM!</Typography>
        <Typography level="body-md">
          The Totally Terrible Server Manager
        </Typography>
      </Sheet>

      <Sheet
        sx={{
          textAlign: "center",
          // my: 4,
          width: "100%",
          px: { xs: 1, md: 2 },
        }}
      >
        <Typography level="h3">About TTSM</Typography>
        <Typography level="body-sm">
          TTSM (Totally Terrible Server Manager) is a web-based server
          management tool designed to make managing game servers easier and more
          convenient. With the TTSM, you can effortlessly start, stop, and
          monitor your game servers, view server logs, and make configuration
          changes with ease.
        </Typography>
        <br />
        <Typography level="body-sm">
          Whether you're a game server administrator or a player looking to
          manage your own server, the TTSM provides a user-friendly interface
          and real-time updates to streamline your server management experience.
        </Typography>
        <br />
        <Typography level="body-sm">
          In addition to server management, TTSM includes user roles and
          profiles, allowing users to change their usernames and passwords. User
          management features are also available for administrators to add,
          edit, and delete users. The application is integrated with Discord,
          enabling bot commands to control servers and provide server updates.
        </Typography>
        <br />
        <Typography level="body-sm">
          TTSM prioritizes security by securely hashing passwords and enforcing
          administrator-created user accounts. The application is flexible and
          can work with any configuration of game servers. It reads information
          from the game_servers directory and dynamically loads the relevant
          server details.
        </Typography>
      </Sheet>

      <Sheet
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          textAlign: "center",
          my: { xs: 2, md: 4 },
          px: { xs: 1, md: 2 },
        }}
      >
        <Typography level="h3">Key Features</Typography>
        <List
          sx={{
            justifyContent: "center",
            // textAlign: "center",
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <ListItem>
            <Typography level="body-sm">
              Real-time server management through WebSocket communication.
            </Typography>
          </ListItem>
          <ListItem>
            <Typography level="body-sm">
              Start, stop, and monitor game servers with ease.
            </Typography>
          </ListItem>
          <ListItem>
            <Typography level="body-sm">
              View server logs and track server performance.
            </Typography>
          </ListItem>
          <ListItem>
            <Typography level="body-sm">
              User roles and profiles for managing usernames and passwords.
            </Typography>
          </ListItem>
          <ListItem>
            <Typography level="body-sm">
              User management with admin features for adding, editing and
              deleting users.
            </Typography>
          </ListItem>
          <ListItem>
            <Typography level="body-sm">
              Integration with Discord for server control and updates.
            </Typography>
          </ListItem>
          <ListItem>
            <Typography level="body-sm">
              Secure password hashing and administrator-controlled user
              registration.
            </Typography>
          </ListItem>
          <ListItem>
            <Typography level="body-sm">
              Flexibility to work with any configuration of game servers.
            </Typography>
          </ListItem>
          <ListItem>
            <Typography level="body-sm">
              Make configuration changes and apply them in real-time.
            </Typography>
          </ListItem>
        </List>
      </Sheet>
    </Sheet>
  );
}

export default function Index() {
  return (
    <CssBaseline>
      <CssVarsProvider defaultMode="system">
        <Head>
          <meta charSet="UTF-8" />
          <title>TTSM - Totally Terrible Server Manager</title>
        </Head>
        <Sheet
          sx={{
            display: "grid",
            gridTemplateColumns: "auto",
            gridTemplateRows: "auto 1fr auto",
            minHeight: "100vh", // set min-height to ensure the layout takes up the full height of the viewport
            minWidth: "fit-content",
          }}
        >
          <List
            orientation="horizontal"
            variant="outlined"
            sx={{
              width: "auto",
              m: { xs: 2, md: 4 },
              p: 1,
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
              <Typography level="h4" component="h1">
                TTSM
              </Typography>
            </ListItem>
            <ListItem>
              <ListItem>
                <Typography level="h4" component="h1"></Typography>
              </ListItem>
            </ListItem>
            <ListItem>
              <Link href={`/login`}>
                <Button variant="solid">Log in</Button>
              </Link>
            </ListItem>
          </List>
          <Sheet
            variant="outlined"
            sx={{
              display: "grid",
              gridTemplateColumns: "auto 1fr",
              minWidth: "fit-content",
              mx: { xs: 2, md: 4 },
              borderRadius: "sm",
              boxShadow: "sm",
            }}
          >
            <Sheet
              sx={{
                px: 1,
                overflowY: "auto",
                height: "100%",
              }}
            >
              <Sheet sx={{ maxHeight: "10px" }}>
                <Content />
              </Sheet>
            </Sheet>
          </Sheet>
          <Footer />
        </Sheet>
      </CssVarsProvider>
    </CssBaseline>
  );
}
