import { Box, CircularProgress, CssBaseline, Sheet } from "@mui/joy";
import { CssVarsProvider } from "@mui/joy/styles";
import Head from "next/head";
import Footer from "./footer";
import * as React from "react";

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
            gridTemplateRows: "auto 1fr auto",
            minHeight: "100vh", // set min-height to ensure the layout takes up the full height of the viewport
            minWidth: "fit-content",
          }}
        >
          <Sheet
            variant="outlined"
            sx={{
              width: "auto",
              mx: 4, // margin left & right
              mt: 4,
              py: 3, // padding top & bottom
              px: 3, // padding left & right
              display: "flex",
              flexDirection: "column",
              gap: 2,
              borderRadius: "sm",
              boxShadow: "md",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress size="lg" />
          </Sheet>
          {/* Box component below is an empty placeholder to force footer to bottom of page */}
          <Box />
          <Footer />
        </Sheet>
      </CssVarsProvider>
    </CssBaseline>
  );
}
