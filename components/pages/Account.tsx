import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { url } from "../../utils/utils";
import {
  Alert,
  Button,
  FormControl,
  FormLabel,
  Input,
  Sheet,
  Typography,
} from "@mui/joy";
import { useSession } from "next-auth/react";

function EditLogin({ theme, username, property, onChange }) {
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

  return (
    <Sheet
      variant="outlined"
      sx={{
        p: { xs: 2, md: 4 },
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
            gridRowGap: { xs: theme.spacing(2), md: theme.spacing(4) },
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
            sx={{ width: "100%", mt: { xs: 3, md: 6 } /* margin top */ }}
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

export default function Account({ theme, username }) {
  const [storedUsername, setStoredUsername] = useState(username);

  const handleUsernameChange = (newUsername) => {
    setStoredUsername(newUsername);
  };

  return (
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
            gridRowGap: { xs: theme.spacing(2), md: theme.spacing(4) },
          }}
        >
          <Sheet
            variant="outlined"
            sx={{
              p: { xs: 2, md: 4 },
              borderRadius: "sm",
              boxShadow: "sm",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Typography level="h3">{`${storedUsername}`}</Typography>
          </Sheet>
          <EditLogin
            theme={theme}
            username={storedUsername}
            property="username"
            onChange={handleUsernameChange}
          />
          <EditLogin
            theme={theme}
            username={storedUsername}
            property="password"
            onChange={handleUsernameChange}
          />
        </Sheet>
      </Sheet>
    </Sheet>
  );
}
