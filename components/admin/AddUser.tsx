import * as React from "react";
import { useState } from "react";
import {
  Alert,
  Button,
  FormControl,
  FormLabel,
  Input,
  Sheet,
  Typography,
} from "@mui/joy";
import RoleSelect from "./RoleSelect";

export default function AddUser({ ws, setUsers }) {
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
      if (data.success) {
        setUsers((prevUsers) => [
          ...prevUsers,
          { username: data.username, role: data.role },
        ]);
        setAddSuccess(true);
      } else {
        setAddError(true);
      }
      setAddDisp(data.username);
    }
  };

  const handleRoleChange = (event, role) => {
    setAddRole(role);
    setAddError(false);
    setAddSuccess(false);
  };

  const handleInputChange = (event) => {
    switch (event.target.name) {
      case "addusername":
        setAddUsername(event.target.value);
        break;
      case "addpassword":
        setAddPassword(event.target.value);
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
          <RoleSelect name="addrole" onChange={handleRoleChange} />
        </FormControl>
        <Button type="submit" sx={{ width: "100%", mt: 6 /* margin top */ }}>
          Add user
        </Button>
      </form>
    </Sheet>
  );
}
