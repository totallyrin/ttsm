import * as React from "react";
import { useState } from "react";
import {
  Alert,
  Button,
  FormControl,
  FormLabel,
  Sheet,
  Typography,
} from "@mui/joy";
import RoleSelect from "./RoleSelect";
import UserSelect from "./UserSelect";

export default function EditUser({ username, ws, users, setUsers }) {
  const [editUsername, setEditUsername] = useState("");
  const [editRole, setEditRole] = useState("user");
  const [editError, setEditError] = useState(false);
  const [editSuccess, setEditSuccess] = useState(false);
  const [editDisp, setEditDisp] = useState("");

  ws.onmessage = function (message) {
    // get data from message
    const data = JSON.parse(message.data);
    if (data.type === "editUser") {
      if (data.success) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.username === data.username
              ? { ...user, role: data.role }
              : user,
          ),
        );
        setEditSuccess(true);
      } else {
        setEditError(true);
      }
      setEditDisp(data.username);
    }
  };

  const handleRoleChange = (event, role) => {
    setEditRole(role);
    setEditError(false);
    setEditSuccess(false);
  };

  const handleUsernameChange = (event, user) => {
    user ? setEditUsername(user.username) : setEditUsername("");
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
          <UserSelect
            username={username}
            users={users}
            name="edituser"
            onChange={handleUsernameChange}
          />
        </FormControl>

        <FormControl sx={{ mt: 2 }}>
          <FormLabel sx={{ pl: 1 }}>Role</FormLabel>
          <RoleSelect name="editrole" onChange={handleRoleChange} />
        </FormControl>

        <Button type="submit" sx={{ width: "100%", mt: 6 /* margin top */ }}>
          Edit user
        </Button>
      </form>
    </Sheet>
  );
}
