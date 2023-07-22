import { useEffect, useState } from "react";
import { Sheet, Typography, useTheme } from "@mui/joy";
import Layout from "../components/layout";
import useServerList from "../utils/useServerList";
import { url } from "../utils/utils";
import CPU from "../components/cpu";
import Memory from "../components/memory";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";

export default function System() {
  const [session, setSession] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function checkSession() {
      const session = await getSession();
      setSession(session);

      if (!session) {
        router.push("/login");
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

  const [serverList, setServerList] = useState<string[]>([]);
  const retrievedServers = useServerList();

  // get server list
  useEffect(() => {
    if (retrievedServers) setServerList(retrievedServers);
  }, [retrievedServers]);

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
    </Layout>,
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
      </Layout>,
    );
  }, [serverList, username, role]);

  return page;
}
