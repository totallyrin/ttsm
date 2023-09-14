import Navbar from "./Navbar";
import Footer from "./Footer";
import { CssBaseline, CssVarsProvider, Sheet, useTheme } from "@mui/joy";
import Sidebar from "./Sidebar";
import Head from "next/head";
import { useMediaQuery } from "@mui/material";

export default function Layout({
  username,
  role,
  title,
  serverList,
  children,
  onPageChange,
}) {
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.up("xs"));

  return (
    <CssBaseline>
      <CssVarsProvider defaultMode="system">
        <Head>
          <meta charSet="UTF-8" />
          <title>{`TTSM - ${title}`}</title>
        </Head>
        <Sheet
          sx={{
            display: "grid",
            gridTemplateColumns: "auto",
            gridTemplateRows: "auto 1fr auto",
            minHeight: "100vh", // set min-height to ensure the layout takes up the full height of the viewport
            minWidth: "fit-content",
          }}
        >
          <Navbar username={username} onPageChange={onPageChange} />
          <Sheet
            sx={{
              display: "grid",
              gridTemplateColumns: "auto 1fr",
              minWidth: "fit-content",
              mx: { xs: 2, s: 3, md: 4 },
            }}
          >
            {!mobile && (
              <Sidebar
                role={role}
                serverList={serverList}
                onPageChange={onPageChange}
              />
            )}
            {children}
          </Sheet>
          <Footer />
        </Sheet>
      </CssVarsProvider>
    </CssBaseline>
  );
}
