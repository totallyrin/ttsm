import Navbar from "./navbar";
import Footer from "./footer";
import { CssBaseline, CssVarsProvider, Sheet } from "@mui/joy";
import Sidebar from "./sidebar";
import Head from "next/head";

export default function Layout({ username, role, page, serverList, children }) {
  const title = `TTSM - ${page}`;

  return (
    <CssBaseline>
      <CssVarsProvider defaultMode="system">
        <Head>
          <meta charSet="UTF-8" />
          <title>{title}</title>
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
          <Navbar username={username} />
          <Sheet
            sx={{
              display: "grid",
              gridTemplateColumns: "auto 1fr",
              minWidth: "fit-content",
              px: 4,
            }}
          >
            <Sidebar role={role} serverList={serverList} />
            {children}
          </Sheet>
          <Footer />
        </Sheet>
      </CssVarsProvider>
    </CssBaseline>
  );
}
