import Navbar from "./Navbar";
import Footer from "./Footer";
import { Box, useTheme } from "@mui/joy";
import Sidebar from "./Sidebar";
import Head from "next/head";
import { useMediaQuery } from "@mui/material";
import SidebarDrawer from "./SidebarDrawer";

export default function Layout({
  username,
  role,
  title,
  serverList,
  children,
  onPageChange,
}) {
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <div>
      <Head>
        <meta charSet="UTF-8" />
        <title>{`TTSM - ${title}`}</title>
      </Head>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "auto",
          gridTemplateRows: "auto 1fr auto",
          height: "100vh",
          // minWidth: "fit-content",
          width: "100vw",
        }}
      >
        <Navbar username={username} onPageChange={onPageChange} />
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "auto 1fr",
            minWidth: "fit-content",
            mx: { xs: 2, s: 3, md: 4 },
          }}
        >
          {mobile ? (
            <SidebarDrawer
              role={role}
              serverList={serverList}
              onPageChange={onPageChange}
            />
          ) : (
            <Box
              sx={{
                mr: { xs: 2, s: 3, md: 4 },
              }}
            >
              <Sidebar
                role={role}
                serverList={serverList}
                onPageChange={onPageChange}
              />
            </Box>
          )}
          {children}
        </Box>
        <Footer />
      </Box>
    </div>
  );
}
