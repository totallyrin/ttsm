import * as React from "react";
import { SessionProvider } from "next-auth/react";
import { CssBaseline, CssVarsProvider, extendTheme } from "@mui/joy";

const theme = extendTheme({
  colorSchemes: {
    light: {},
    dark: {
      palette: {
        background: {
          // surface: "#000000",
        },
      },
    },
  },
});

export default function App({ Component, pageProps }) {
  return (
    <CssBaseline>
      <CssVarsProvider defaultMode="system" theme={theme}>
        <SessionProvider session={pageProps.session}>
          <Component {...pageProps} />
        </SessionProvider>
      </CssVarsProvider>
    </CssBaseline>
  );
}
