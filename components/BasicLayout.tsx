import { Box, CssBaseline, Sheet } from "@mui/joy";
import { CssVarsProvider } from "@mui/joy/styles";
import Head from "next/head";
import Footer from "./Footer";
import * as React from "react";
import Loading from "./Loading";

export default function BasicLayout() {
  return (
    <CssBaseline>
      <CssVarsProvider defaultMode="system">
        <Head>
          <meta charSet="UTF-8" />
          <title>TTSM - Login</title>
        </Head>
        <Sheet
          sx={{
            display: "grid",
            gridTemplateColumns: "auto",
            gridTemplateRows: "1fr auto",
            minHeight: "100vh", // set min-height to ensure the layout takes up the full height of the viewport
            minWidth: "fit-content",
          }}
        >
          <Loading />
          {/* Box component below is an empty placeholder to force footer to bottom of page */}
          <Box />
          <Footer />
        </Sheet>
      </CssVarsProvider>
    </CssBaseline>
  );
}
