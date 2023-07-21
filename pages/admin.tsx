import * as React from "react";
import {useEffect, useState} from "react";
import useServerList from "../utils/useServerList";
import Layout from "../components/layout";
import {url} from "../utils/utils";
import {Alert, Button, FormControl, FormLabel, Input, Sheet, Typography, useTheme,} from "@mui/joy";

// export async function getServerSideProps(context) {
//   const session = await getSession(context);
//
//   if (!session) {
//     return {
//       redirect: {
//         destination: "/login",
//         permanent: false,
//       },
//     };
//   }
//
//   // @ts-ignore
//   const role = session.role;
//
//   if (role !== "admin") {
//     return {
//       redirect: {
//         destination: "/home",
//         permanent: false,
//       },
//     };
//   }
//
//   const username = session.user?.name ? session.user.name : "";
//
//   return {
//     props: {
//       username: username,
//       role: role,
//     },
//   };
// }

export default function Admin({ username, role }) {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [serverList, setServerList] = useState<string[]>([]);
  const retrievedServers = useServerList();

  const [addUsername, setAddUsername] = useState("");
  const [addPassword, setAddPassword] = useState("");
  const [addRole, setAddRole] = useState("");
  const [addError, setAddError] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);
  const [addIsClicked, setAddIsClicked] = useState(false);
  const [addDisp, setAddDisp] = useState("");

  const [editUsername, setEditUsername] = useState("");
  const [editRole, setEditRole] = useState("");
  const [editError, setEditError] = useState(false);
  const [editSuccess, setEditSuccess] = useState(false);
  const [editIsClicked, setEditIsClicked] = useState(false);
  const [editDisp, setEditDisp] = useState("");

  const [delUsername, setDelUsername] = useState("");
  const [delError, setDelError] = useState(false);
  const [delSuccess, setDelSuccess] = useState(false);
  const [delIsClicked, setDelIsClicked] = useState(false);
  const [delDisp, setDelDisp] = useState("");

  // open single websocket
  useEffect(() => {
    const websocket = new WebSocket(url);
    setWs(websocket);

    websocket.onopen = () => {
      websocket.send(JSON.stringify({ type: "username", username: username }));
    };
    // receive messages from server
    websocket.onmessage = function (message) {
      // get data from message
      const data = JSON.parse(message.data);
      switch (data.type) {
        case "addUser":
          data.success ? setAddSuccess(true) : setAddError(true);
          setAddDisp(data.username);
          break;
        case "delUser":
          data.success ? setDelSuccess(true) : setDelError(true);
          setDelDisp(data.username);
          break;
        case "editUser":
          data.success ? setEditSuccess(true) : setEditError(true);
          setEditDisp(data.username);
          break;
      }
    };

    websocket.onclose = () => {
      console.log("websocket was closed");
    };
  }, []);

  // get server list
  useEffect(() => {
    if (retrievedServers) setServerList(retrievedServers);
  }, [retrievedServers]);

  const theme = useTheme();

  return (
    <Layout
      username={username}
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
            {/* add user */}
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

              <form onSubmit={(e) => e.preventDefault()}>
                <FormControl sx={{ mt: 2 }}>
                  <FormLabel sx={{ pl: 1 }}>Username</FormLabel>
                  <Input
                    name="username"
                    type="username"
                    placeholder="username"
                    value={addUsername}
                    onChange={(event) => {
                      setAddUsername(event.target.value);
                      setAddError(false);
                      setAddSuccess(false);
                    }}
                  />
                </FormControl>

                <FormControl sx={{ mt: 2 }}>
                  <FormLabel sx={{ pl: 1 }}>Password</FormLabel>
                  <Input
                    name="password"
                    type="password"
                    placeholder="password"
                    value={addPassword}
                    onChange={(event) => {
                      setAddPassword(event.target.value);
                      setAddError(false);
                      setAddSuccess(false);
                    }}
                  />
                </FormControl>

                <FormControl sx={{ mt: 2 }}>
                  <FormLabel sx={{ pl: 1 }}>Role</FormLabel>
                  <Input
                    name="role"
                    type="role"
                    placeholder="user"
                    value={addRole}
                    onChange={(event) => {
                      setAddRole(event.target.value);
                      setAddError(false);
                      setAddSuccess(false);
                    }}
                  />
                </FormControl>

                <Button
                  type="submit"
                  disabled={addIsClicked}
                  sx={{ width: "100%", mt: 6 /* margin top */ }}
                  onClick={(e) => {
                    console.log(addUsername);
                    setAddIsClicked(true);
                    setAddError(false);
                    setAddSuccess(false);
                    if (addUsername !== "") {
                      e.preventDefault();
                      // send command to server
                      if (ws) {
                        ws.send(
                          JSON.stringify({
                            type: "addUser",
                            username: addUsername,
                            password: addPassword,
                            role: addRole,
                          }),
                        );
                      } else {
                        const websocket = new WebSocket(url);

                        websocket.onopen = () => {
                          websocket.send(
                            JSON.stringify({
                              type: "addUser",
                              username: addUsername,
                              password: addPassword,
                              role: addRole,
                            }),
                          );

                          websocket.close();
                        };
                      }
                    }
                    setAddUsername("");
                    setAddPassword("");
                    setAddRole("");
                    setAddIsClicked(false);
                  }}
                >
                  Add user
                </Button>
              </form>
            </Sheet>

            {/* edit user */}
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

            {/* delete user */}
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
          </Sheet>
        </Sheet>
      </Sheet>
    </Layout>
  );
}
