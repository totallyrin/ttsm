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
import UserSelect from "./UserSelect";

export default function DelUser({ username, users, ws, setUsers }) {
  const [delUsername, setDelUsername] = useState("");
  const [delError, setDelError] = useState(false);
  const [delSuccess, setDelSuccess] = useState(false);
  const [delDisp, setDelDisp] = useState("");

  // receive messages from server
  ws.onmessage = function (message) {
    // get data from message
    const data = JSON.parse(message.data);
    if (data.type === "delUser") {
      if (data.success) {
        setUsers((prevUsers) =>
          prevUsers.filter((user) => user.username !== data.username),
        );
        setDelSuccess(true);
      } else {
        setDelError(true);
      }
      setDelDisp(data.username);
    }
  };

  return (
    <Sheet
      variant="outlined"
      sx={{
        p: { xs: 2, md: 4 },
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
        }}
      >
        <FormControl sx={{ mt: { xs: 1, md: 2 } }}>
          <FormLabel sx={{ pl: 1 }}>Username</FormLabel>
          <UserSelect
            username={username}
            users={users}
            name="delusername"
            onChange={(event, user) => {
              user ? setDelUsername(user.username) : setDelUsername("");
              setDelSuccess(false);
            }}
          />
        </FormControl>

        <Button
          type="submit"
          sx={{ width: "100%", mt: { xs: 3, md: 6 } /* margin top */ }}
        >
          Delete user
        </Button>
      </form>
    </Sheet>
  );
}
