import * as React from "react";
import { useEffect, useState } from "react";
import { useTheme } from "@mui/joy";
import Layout from "../components/Layout";
import useServerList from "../utils/useServerList";
import { url } from "../utils/utils";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import HomePage from "../components/pages/HomePage";
import System from "../components/pages/System";
import Admin from "../components/pages/Admin";
import BasicLayout from "../components/BasicLayout";
import Game from "../components/pages/Game";
import Loading from "../components/Loading";

export default function Page() {
  const [session, setSession] = useState(null);
  const [auth, setAuth] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function checkSession() {
      const session = await getSession();
      setSession(session);

      if (!session) {
        router.push("/login");
      } else {
        setAuth(true);
      }
    }

    checkSession();
  }, []);

  const [username, setUsername] = useState("");
  const [role, setRole] = useState(null);

  useEffect(() => {
    setUsername(session?.user?.name ?? "");
    setRole(session?.role);
  }, [session]);

  const [ws, setWs] = useState<WebSocket | null>(null);

  // open single websocket
  useEffect(() => {
    const websocket = new WebSocket(url);
    setWs(websocket);

    websocket.onopen = () => {
      websocket.send(
        JSON.stringify({
          type: "username",
          username: username,
        }),
      );
    };
    // receive messages from server
    websocket.onmessage = function (message) {
      // get data from message
      const data = JSON.parse(message.data);
      // if message is about server status, update relevant status
      if (data.type === "serverState") {
        setRunningList((prevRunningList) => {
          const temp = { ...prevRunningList };
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
      const temp = {};
      serverList.forEach(function (game) {
        temp[game] = "pinging";
      });
      setRunningList(temp);
    }
  }, [serverList]);

  const [dashboard, setDashboard] = useState(router.query.page);
  const [page, setPage] = useState<JSX.Element>(<BasicLayout />);

  useEffect(() => {
    if (!router.isReady) return;
    setDashboard(router.query.page[0]);
  }, [router.isReady]);

  const handlePageChange = (newPage) => {
    setDashboard(newPage);
    router.push(`${newPage}`);
  };

  const theme = useTheme();

  useEffect(() => {
    if (auth) {
      let title = "Loading...";
      if (typeof dashboard === "string") {
        title = dashboard.charAt(0).toUpperCase() + dashboard.slice(1);
        setPage(
          <Layout
            username={username}
            role={role}
            title={title}
            serverList={serverList}
            onPageChange={handlePageChange}
          >
            {dashboard === "home" && (
              <HomePage
                theme={theme}
                username={username}
                role={role}
                serverList={serverList}
                runningList={runningList}
              />
            )}
            {dashboard === "admin" && (
              <Admin theme={theme} username={username} />
            )}
            {dashboard === "system" && <System theme={theme} />}
            {dashboard.includes("servers/") && (
              <Game
                theme={theme}
                username={username}
                role={role}
                runningList={runningList}
                game={dashboard.split("/")[1]}
              />
            )}
          </Layout>,
        );
      } else {
        setPage(
          <Layout
            username={username}
            role={role}
            title={title}
            serverList={serverList}
            onPageChange={handlePageChange}
          >
            <Loading />
          </Layout>,
        );
      }
    }
  }, [ws, serverList, runningList, username, role, auth, dashboard]);

  return page;
}
