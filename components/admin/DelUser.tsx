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

export default function DelUser({ username, users, ws }) {
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
          {/*<Input*/}
          {/*  name="delusername"*/}
          {/*  placeholder="username"*/}
          {/*  value={delUsername}*/}
          {/*  required*/}
          {/*  autoComplete="off"*/}
          {/*  onChange={(event) => {*/}
          {/*    setDelUsername(event.target.value);*/}
          {/*    setDelError(false);*/}
          {/*    setDelSuccess(false);*/}
          {/*  }}*/}
          {/*  onSubmit={(event) => {*/}
          {/*    event.preventDefault();*/}
          {/*    setDelError(false);*/}
          {/*    setDelSuccess(false);*/}
          {/*  }}*/}
          {/*/>*/}
          <UserSelect
            username={username}
            users={users}
            name="delusername"
            onChange={(event, username) => {
              setDelUsername(username);
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
