import * as React from "react";
import { useEffect, useState } from "react";
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

function AddUser({ ws }) {
  const [addUsername, setAddUsername] = useState("");
  const [addPassword, setAddPassword] = useState("");
  const [addRole, setAddRole] = useState("");
  const [addError, setAddError] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);
  const [addDisp, setAddDisp] = useState("");

  // receive messages from server
  ws.onmessage = function (message) {
    // get data from message
    const data = JSON.parse(message.data);
    if (data.type === "AddUser") {
      data.success ? setAddSuccess(true) : setAddError(true);
      setAddDisp(data.username);
    }
  };

  const handleInputChange = (event) => {
    switch (event.target.name) {
      case "username":
        setAddUsername(event.target.value);
        break;
      case "password":
        setAddPassword(event.target.value);
        break;
      case "role":
        setAddRole(event.target.value);
        break;
    }
    setAddError(false);
    setAddSuccess(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (addUsername !== "") {
      // send command to server
      ws.send(
        JSON.stringify({
          type: "AddUser",
          username: addUsername,
          password: addPassword,
          role: addRole,
        }),
      );
    }
    setAddUsername("");
    setAddPassword("");
    setAddRole("");
  };

  return (
    <Sheet
      variant="outlined"
      sx={{
        p: 4,
        borderRadius: "sm",
        boxShadow: "sm",
        display: "grid",
      }}
    >
      <Typography level="h4" sx={{ alignSelf: "center", mb: 1 }}>
        Add user
      </Typography>
      {addError && (
        <Alert color="danger" variant="solid">
          An error occurred; cannot add user {addDisp}.
        </Alert>
      )}
      {addSuccess && (
        <Alert color="success" variant="solid">
          User {addDisp} added successfully!
        </Alert>
      )}
      <form onSubmit={handleSubmit}>
        <FormControl sx={{ mt: 2 }}>
          <FormLabel sx={{ pl: 1 }}>Username</FormLabel>
          <Input
            name="username"
            type="username"
            placeholder="username"
            value={addUsername}
            onChange={handleInputChange}
          />
        </FormControl>
        <FormControl sx={{ mt: 2 }}>
          <FormLabel sx={{ pl: 1 }}>Password</FormLabel>
          <Input
            name="password"
            type="password"
            placeholder="password"
            value={addPassword}
            onChange={handleInputChange}
          />
        </FormControl>
        <FormControl sx={{ mt: 2 }}>
          <FormLabel sx={{ pl: 1 }}>Role</FormLabel>
          <Input
            name="role"
            type="role"
            placeholder="user"
            value={addRole}
            onChange={handleInputChange}
          />
        </FormControl>
        <Button type="submit" sx={{ width: "100%", mt: 6 /* margin top */ }}>
          Add user
        </Button>
      </form>
    </Sheet>
  );
}

function EditUser({ ws }) {
  const [editUsername, setEditUsername] = useState("");
  const [editRole, setEditRole] = useState("");
  const [editError, setEditError] = useState(false);
  const [editSuccess, setEditSuccess] = useState(false);
  const [editIsClicked, setEditIsClicked] = useState(false);
  const [editDisp, setEditDisp] = useState("");

  ws.onmessage = function (message) {
    // get data from message
    const data = JSON.parse(message.data);
    if (data.type === "editUser") {
      data.success ? setEditSuccess(true) : setEditError(true);
      setEditDisp(data.username);
    }
  };

  return (
    <Sheet
      variant="outlined"
      sx={{
        p: 4,
        borderRadius: "sm",
        boxShadow: "sm",
        display: "grid",
      }}
    >
      <Typography
        level="h4"
        sx={{
          alignSelf: "center",
          mb: 1,
        }}
      >
        Edit user
      </Typography>

      {editError && (
        <Alert color="danger" variant="solid">
          An error occurred; cannot edit user {editDisp}.
        </Alert>
      )}

      {editSuccess && (
        <Alert color="success" variant="solid">
          User {editDisp} edited successfully!
        </Alert>
      )}

      <form onSubmit={(e) => e.preventDefault()}>
        <FormControl sx={{ mt: 2 }}>
          <FormLabel sx={{ pl: 1 }}>Username</FormLabel>
          <Input
            name="username"
            type="username"
            placeholder="username"
            value={editUsername}
            onChange={(event) => {
              setEditUsername(event.target.value);
              setEditError(false);
              setEditSuccess(false);
            }}
            onSubmit={(event) => {
              event.preventDefault();
              setEditError(false);
              setEditSuccess(false);
            }}
          />
        </FormControl>

        <FormControl sx={{ mt: 2 }}>
          <FormLabel sx={{ pl: 1 }}>Role</FormLabel>
          <Input
            name="role"
            type="role"
            placeholder="user"
            value={editRole}
            onChange={(event) => {
              setEditRole(event.target.value);
              setEditError(false);
              setEditSuccess(false);
            }}
            onSubmit={(event) => {
              event.preventDefault();
              setEditError(false);
              setEditSuccess(false);
            }}
          />
        </FormControl>

        <Button
          type="submit"
          disabled={editIsClicked}
          sx={{ width: "100%", mt: 6 /* margin top */ }}
          onClick={async (e) => {
            setEditIsClicked(true);
            setEditError(false);
            setEditSuccess(false);
            if (editUsername !== "") {
              e.preventDefault();
              // send command to server
              if (ws) {
                console.log();
                ws.send(
                  JSON.stringify({
                    type: "editUser",
                    username: editUsername,
                    role: editRole,
                  }),
                );
              } else {
                const websocket = new WebSocket(url);

                websocket.onopen = async () => {
                  await websocket.send(
                    JSON.stringify({
                      type: "editUser",
                      username: editUsername,
                      role: editRole,
                    }),
                  );

                  websocket.close();
                };
              }
            }
            setEditUsername("");
            setEditRole("");
            setEditIsClicked(false);
          }}
        >
          Edit user
        </Button>
      </form>
    </Sheet>
  );
}

function DelUser({ ws }) {
  const [delUsername, setDelUsername] = useState("");
  const [delError, setDelError] = useState(false);
  const [delSuccess, setDelSuccess] = useState(false);
  const [delIsClicked, setDelIsClicked] = useState(false);
  const [delDisp, setDelDisp] = useState("");

  // receive messages from server
  ws.onmessage = function (message) {
    // get data from message
    const data = JSON.parse(message.data);
    if (data.type === "delUser") {
      data.success ? setDelSuccess(true) : setDelError(true);
      setDelDisp(data.username);
    }
  };

  return (
    <Sheet
      variant="outlined"
      sx={{
        p: 4,
        borderRadius: "sm",
        boxShadow: "sm",
        display: "grid",
      }}
    >
      <Typography
        level="h4"
        sx={{
          alignSelf: "center",
          mb: 1,
        }}
      >
        Delete user
      </Typography>

      {delError && (
        <Alert color="danger" variant="solid">
          An error occurred; cannot delete user {delDisp}.
        </Alert>
      )}

      {delSuccess && (
        <Alert color="success" variant="solid">
          User {delDisp} deleted successfully!
        </Alert>
      )}

      <form onSubmit={(e) => e.preventDefault()}>
        <FormControl sx={{ mt: 2 }}>
          <FormLabel sx={{ pl: 1 }}>Username</FormLabel>
          <Input
            name="username"
            type="username"
            placeholder="username"
            value={delUsername}
            onChange={(event) => {
              setDelUsername(event.target.value);
              setDelError(false);
              setDelSuccess(false);
            }}
            onSubmit={(event) => {
              event.preventDefault();
              setDelError(false);
              setDelSuccess(false);
            }}
          />
        </FormControl>

        <Button
          type="submit"
          disabled={delIsClicked}
          sx={{ width: "100%", mt: 6 /* margin top */ }}
          onClick={async (e) => {
            setDelIsClicked(true);
            setDelError(false);
            setDelSuccess(false);
            if (delUsername !== "") {
              e.preventDefault();
              // send command to server
              if (ws) {
                ws.send(
                  JSON.stringify({
                    type: "delUser",
                    username: delUsername,
                  }),
                );
              } else {
                const websocket = new WebSocket(url);

                websocket.onopen = () => {
                  websocket.send(
                    JSON.stringify({
                      type: "delUser",
                      username: delUsername,
                    }),
                  );
                };

                websocket.close();
              }
            }
            setDelUsername("");
            setDelIsClicked(false);
          }}
        >
          Delete user
        </Button>
      </form>
    </Sheet>
  );
}

export default function Admin({ theme, username }) {
  const [ws, setWs] = useState<WebSocket | null>(null);

  // open single websocket
  useEffect(() => {
    const websocket = new WebSocket(url);
    setWs(websocket);

    websocket.onopen = () => {
      websocket.send(JSON.stringify({ type: "username", username: username }));
    };

    websocket.onclose = () => {
      console.log("websocket was closed");
    };
  }, []);

  const [page, setPage] = useState(<Sheet />);

  useEffect(() => {
    if (ws && ws.OPEN) {
      setPage(
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
              {/* add user */}
              <AddUser ws={ws} />
              {/* edit user */}
              <EditUser ws={ws} />
              {/* delete user */}
              <DelUser ws={ws} />
            </Sheet>
          </Sheet>
        </Sheet>,
      );
    }
  }, [ws]);

  return page;
}
