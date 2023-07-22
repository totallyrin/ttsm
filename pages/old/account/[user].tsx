import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { url } from "../../../utils/utils";
import useServerList from "../../../utils/useServerList";
import Layout from "../../../components/Layout";
import {
  Alert,
  Button,
  CircularProgress,
  FormControl,
  FormLabel,
  Input,
  Sheet,
  Typography,
  useTheme,
} from "@mui/joy";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";

function EditLogin({ username, property, onChange }) {
  const { update } = useSession();
  const [oldProperty, setOldProperty] = useState("");
  const [newProperty, setNewProperty] = useState("");
  const [isClicked, setClicked] = useState(false);
  const [isError, setError] = useState(false);
  const [isSuccess, setSuccess] = useState(false);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [user, setUser] = useState(username);

  const newPropertyRef = useRef(newProperty);

  useEffect(() => {
    newPropertyRef.current = newProperty;
  }, [newProperty]);

  // open single websocket
  useEffect(() => {
    const ws = new WebSocket(url);
    setWs(ws);
    // receive messages from server
    ws.onmessage = async function (event) {
      // get data from message
      const data = JSON.parse(event.data);
      if (data.type === "saveUser") {
        if (data.success) {
          setSuccess(true);
          if (property === "username") {
            await update({ username: newPropertyRef.current });
            setUser(newPropertyRef.current);
            onChange(newPropertyRef.current);
          }
          setOldProperty("");
          setNewProperty("");
        } else {
          setError(true);
        }
      }
    };
  }, []);

  const changeProperty = (event) => {
    event.preventDefault();
    // send command to server
    if (ws) {
      ws.send(
        JSON.stringify({
          type: "change",
          property: property,
          username: user,
          password: oldProperty,
          new: newProperty,
        }),
      );
    }
  };

  const theme = useTheme();

  return (
    <Sheet
      variant="outlined"
      sx={{
        p: 4,
        borderRadius: "sm",
        boxShadow: "sm",
      }}
    >
      <form onSubmit={(e) => e.preventDefault()}>
        <Sheet
          sx={{
            overflowY: "auto",
            display: "grid",
            gridTemplateColumns: "auto",
            gridTemplateRows:
              isError || isSuccess ? "auto 1fr auto" : "1fr auto",
            gridRowGap: theme.spacing(2),
            alignItems: "center",
          }}
        >
          <Typography
            level="h4"
            sx={{
              alignSelf: "center",
              mb: 1,
            }}
          >
            Change {`${property}`}
          </Typography>

          {isError && (
            <Alert color="danger" variant="solid">
              An error occurred; cannot change {`${property}`}.
            </Alert>
          )}

          {isSuccess && (
            <Alert color="success" variant="solid">
              {`${property.charAt(0).toUpperCase() + property.slice(1)}`}{" "}
              changed successfully!
            </Alert>
          )}

          <Sheet>
            <FormControl>
              <FormLabel sx={{ pl: 1 }}>Current password</FormLabel>
              <Input
                name="curr-prop"
                type={"password"}
                placeholder={`Current password`}
                value={oldProperty}
                onChange={(event) => {
                  setError(false);
                  setSuccess(false);
                  setOldProperty(event.target.value);
                }}
                onSubmit={(event) => {
                  event.preventDefault();
                  setError(false);
                  setSuccess(false);
                }}
              />
            </FormControl>
            <FormControl sx={{ mt: 2 }}>
              <FormLabel sx={{ pl: 1 }}>New {`${property}`}</FormLabel>
              <Input
                name="new-prop"
                type={property === "username" ? "username" : "password"}
                placeholder={`New ${property}`}
                value={newProperty}
                onChange={(event) => {
                  setNewProperty(event.target.value);
                  setError(false);
                  setSuccess(false);
                }}
                onSubmit={(event) => {
                  event.preventDefault();
                  setError(false);
                  setSuccess(false);
                }}
              />
            </FormControl>
          </Sheet>

          <Button
            type="submit"
            disabled={isClicked}
            sx={{ width: "100%", mt: 6 /* margin top */ }}
            onClick={async (e) => {
              setClicked(true);
              setError(false);
              setSuccess(false);
              if (oldProperty !== "" && newProperty !== "") {
                changeProperty(e);
              }
              setClicked(false);
            }}
          >
            Change {`${property}`}
          </Button>
        </Sheet>
      </form>
    </Sheet>
  );
}

export default function User() {
  const [session, setSession] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function checkSession() {
      const session = await getSession();
      setSession(session);

      if (!session) {
        router.push("/login");
      }
    }

    checkSession();
  }, []);

  const [username, setUsername] = useState("");
  const [role, setRole] = useState(null);

  const [storedUsername, setStoredUsername] = useState(username);

  useEffect(() => {
    setUsername(session?.user?.name ?? "");
    setRole(session?.role);
    setStoredUsername(username);
  }, [session]);

  const handleUsernameChange = (newUsername) => {
    setStoredUsername(newUsername);
  };

  const [serverList, setServerList] = useState<string[]>([]);
  const retrievedServers = useServerList();

  // get server list
  useEffect(() => {
    if (retrievedServers) setServerList(retrievedServers);
  }, [retrievedServers]);

  const [page, setPage] = useState<JSX.Element>(
    // <Layout
    //   username={username}
    //   role={role}
    //   page={"Page"}
    //   serverList={serverList}
    // >
    //   <Sheet
    //     sx={{
    //       display: "grid",
    //       gridTemplateColumns: "auto",
    //       gridTemplateRows: "auto",
    //       minHeight: "100%", // set min-height to ensure the layout takes up the full height of the viewport
    //       minWidth: "fit-content",
    //     }}
    //   >
    //     <Typography level="h3">Loading...</Typography>
    //   </Sheet>
    // </Layout>,
    <CircularProgress size="lg" />,
  );

  const theme = useTheme();

  useEffect(() => {
    // @ts-ignore
    setPage(
      <Layout
        username={storedUsername}
        role={role}
        page={`Account`}
        serverList={serverList}
      >
        <Sheet
          sx={{
            overflowY: "auto",
            display: "grid",
            gridTemplateColumns: "auto",
            gridTemplateRows: "1fr auto",
            height: "100%",
          }}
        >
          <Sheet
            sx={{
              maxHeight: "10px",
            }}
          >
            <Sheet
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gridTemplateRows: "auto 1fr 1fr",
                gridRowGap: theme.spacing(4),
              }}
            >
              <Sheet
                variant="outlined"
                sx={{
                  p: 4,
                  borderRadius: "sm",
                  boxShadow: "sm",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Typography level="h3">{`${storedUsername}`}</Typography>
              </Sheet>
              <EditLogin
                username={storedUsername}
                property="username"
                onChange={handleUsernameChange}
              />
              <EditLogin
                username={storedUsername}
                property="password"
                onChange={handleUsernameChange}
              />
            </Sheet>
          </Sheet>
        </Sheet>
      </Layout>,
    );
  }, [serverList, storedUsername, role]);

  return page;
}
