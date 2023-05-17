import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import { Sheet, Typography, useTheme } from "@mui/joy";
import Layout from "../components/layout";
import useServerList from "../utils/useServerList";
import { url } from "../utils/utils";
import CPU from "../components/cpu";
import Memory from "../components/memory";

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const username = session.user?.name ? session.user.name : "";
  // @ts-ignore
  const role = session.role;

  return {
    props: {
      username: username,
      role: role,
    },
  };
}

export default function System({ username, role }) {
  const [ws, setWs] = useState<WebSocket | null>(null);

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
      // if message is about server status, update relevant status
      if (data.type === "serverState") {
        setRunningList((prevRunningList) => {
          let temp = { ...prevRunningList };
          temp[data.game] = data.running;
          return temp;
        });
      }
      if (data.type === "debug") console.log(data.msg);
    };

    websocket.onclose = () => {
      console.log("websocket was closed");
    };
  }, []);

  const [serverList, setServerList] = useState<string[]>([]);
  const retrievedServers = useServerList();

  // get server list
  useEffect(() => {
    if (retrievedServers) setServerList(retrievedServers);
  }, [retrievedServers]);

  const [runningList, setRunningList] = useState({});
  // initialize server statuses
  useEffect(() => {
    if (serverList) {
      let temp = {};
      serverList.forEach(function (game) {
        temp[game] = "pinging";
      });
      setRunningList(temp);
    }
  }, [serverList]);

  const [page, setPage] = useState<JSX.Element>(
    <Layout
      username={username}
      role={role}
      page={"Home"}
      serverList={serverList}
    >
      <Sheet
        sx={{
          display: "grid",
          gridTemplateColumns: "auto",
          gridTemplateRows: "auto",
          minHeight: "100%", // set min-height to ensure the layout takes up the full height of the viewport
          minWidth: "fit-content",
        }}
      >
        <Typography level="h3">Loading...</Typography>
      </Sheet>
    </Layout>
  );

  const theme = useTheme();

  useEffect(() => {
    setPage(
      <Layout
        username={username}
        role={role}
        page={"System"}
        serverList={serverList}
      >
        <Sheet
          sx={{
            display: "grid",
            gridTemplateColumns: "auto",
            gridTemplateRows: "1fr 1fr",
            gridRowGap: theme.spacing(4),
          }}
        >
          <CPU url={url} />
          <Memory url={url} />
        </Sheet>
      </Layout>
    );
  }, [ws, serverList, runningList]);

  return page;
}
