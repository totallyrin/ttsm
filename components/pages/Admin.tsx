import * as React from "react";
import { useEffect, useState } from "react";
import { url } from "../../utils/utils";
import {
  Alert,
  Button,
  FormControl,
  FormLabel,
  Input,
  Option,
  Select,
  Sheet,
  Typography,
} from "@mui/joy";

function RoleSelect({ onChange }) {
  return (
    <Select
      name="role"
      // type="role"
      defaultValue="user"
      // value={addRole}
      onChange={onChange}
    >
      <Option value="no-auth">No-auth</Option>
      <Option value="user">User</Option>
      <Option value="admin">Admin</Option>
    </Select>
  );
}

function AddUser({ ws }) {
  const [addUsername, setAddUsername] = useState("");
  const [addPassword, setAddPassword] = useState("");
  const [addRole, setAddRole] = useState("user");
  const [addError, setAddError] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);
  const [addDisp, setAddDisp] = useState("");

  // receive messages from server
  ws.onmessage = function (message) {
    // get data from message
    const data = JSON.parse(message.data);
    if (data.type === "addUser") {
      data.success ? setAddSuccess(true) : setAddError(true);
      setAddDisp(data.username);
    }
  };

  const handleInputChange = (event) => {
    switch (event.target.name) {
      case "addusername":
        setAddUsername(event.target.value);
        break;
      case "addpassword":
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
          type: "addUser",
          username: addUsername,
          password: addPassword,
          role: addRole,
        }),
      );
    }
    setAddUsername("");
    setAddPassword("");
    setAddRole("");
    setAddError(false);
    setAddSuccess(false);
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
          An error occurred; cannot add user '{addDisp}'.
        </Alert>
      )}
      {addSuccess && (
        <Alert color="success" variant="solid">
          User '{addDisp}' added successfully!
        </Alert>
      )}
      <form onSubmit={handleSubmit}>
        <FormControl sx={{ mt: 2 }}>
          <FormLabel sx={{ pl: 1 }}>Username</FormLabel>
          <Input
            name="addusername"
            placeholder="username"
            value={addUsername}
            onChange={handleInputChange}
            required
            autoComplete="off"
          />
        </FormControl>
        <FormControl sx={{ mt: 2 }}>
          <FormLabel sx={{ pl: 1 }}>Password</FormLabel>
          <Input
            name="addpassword"
            placeholder="password"
            value={addPassword}
            onChange={handleInputChange}
            autoComplete="off"
          />
        </FormControl>
        <FormControl sx={{ mt: 2 }}>
          <FormLabel sx={{ pl: 1 }}>Role</FormLabel>
          <RoleSelect onChange={handleInputChange} />
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
  const [editDisp, setEditDisp] = useState("");

  ws.onmessage = function (message) {
    // get data from message
    const data = JSON.parse(message.data);
    if (data.type === "editUser") {
      data.success ? setEditSuccess(true) : setEditError(true);
      setEditDisp(data.username);
    }
  };

  const handleInputChange = (event) => {
    switch (event.target.name) {
      case "editusername":
        setEditUsername(event.target.value);
        break;
      case "role":
        setEditRole(event.target.value);
        break;
    }
    setEditError(false);
    setEditSuccess(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (editUsername !== "") {
      // send command to server
      ws.send(
        JSON.stringify({
          type: "editUser",
          username: editUsername,
          role: editRole,
        }),
      );
    }
    setEditUsername("");
    setEditRole("");
    setEditError(false);
    setEditSuccess(false);
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
          An error occurred; cannot edit user '{editDisp}'.
        </Alert>
      )}

      {editSuccess && (
        <Alert color="success" variant="solid">
          User '{editDisp}' edited successfully!
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <FormControl sx={{ mt: 2 }}>
          <FormLabel sx={{ pl: 1 }}>Username</FormLabel>
          <Input
            name="editusername"
            placeholder="username"
            value={editUsername}
            onChange={handleInputChange}
            required
            autoComplete="off"
          />
        </FormControl>

        <FormControl sx={{ mt: 2 }}>
          <FormLabel sx={{ pl: 1 }}>Role</FormLabel>
          <RoleSelect onChange={handleInputChange} />
        </FormControl>

        <Button type="submit" sx={{ width: "100%", mt: 6 /* margin top */ }}>
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
          An error occurred; cannot delete user '{delDisp}'.
        </Alert>
      )}

      {delSuccess && (
        <Alert color="success" variant="solid">
          User '{delDisp}' deleted successfully!
        </Alert>
      )}

      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (delUsername !== "") {
            // send command to server
            ws.send(
              JSON.stringify({
                type: "delUser",
                username: delUsername,
              }),
            );
          }
          setDelUsername("");
        }}
      >
        <FormControl sx={{ mt: 2 }}>
          <FormLabel sx={{ pl: 1 }}>Username</FormLabel>
          <Input
            name="delusername"
            placeholder="username"
            value={delUsername}
            required
            autoComplete="off"
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

        <Button type="submit" sx={{ width: "100%", mt: 6 /* margin top */ }}>
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
