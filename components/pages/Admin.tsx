import * as React from "react";
import { useEffect, useState } from "react";
import { url } from "../../utils/utils";
import { Box, Sheet } from "@mui/joy";
import AddUser from "../admin/AddUser";
import EditUser from "../admin/EditUser";
import DelUser from "../admin/DelUser";

export default function Admin({ theme, username }) {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [users, setUsers] = useState([]);

  // open single websocket
  useEffect(() => {
    const websocket = new WebSocket(url);
    setWs(websocket);

    websocket.onopen = () => {
      websocket.send(JSON.stringify({ type: "username", username: username }));
      websocket.send(JSON.stringify({ type: "users" }));
    };

    websocket.addEventListener("message", (message) => {
      // get data from message
      const data = JSON.parse(message.data);
      if (data.type === "users") {
        setUsers(data.users);
      }
    });
  }, []);

  const [page, setPage] = useState(<Sheet />);

  useEffect(() => {
    if (ws && ws.OPEN) {
      setPage(
        <Box
          sx={{
            overflowY: "auto",
            display: "grid",
            gridTemplateColumns: "auto",
            gridTemplateRows: "1fr auto",
            height: "100%",
          }}
        >
          <Box
            sx={{
              maxHeight: "10px",
            }}
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gridTemplateRows: "auto auto auto",
                gridRowGap: { xs: theme.spacing(2), md: theme.spacing(4) },
              }}
            >
              {/* add user */}
              <AddUser ws={ws} setUsers={setUsers} />
              {/* edit user */}
              <EditUser
                username={username}
                users={users}
                ws={ws}
                setUsers={setUsers}
              />
              {/* delete user */}
              <DelUser
                username={username}
                users={users}
                ws={ws}
                setUsers={setUsers}
              />
            </Box>
          </Box>
        </Box>,
      );
    }
  }, [ws, users]);

  return page;
}
