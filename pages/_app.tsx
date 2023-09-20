import * as React from "react";
import { SessionProvider } from "next-auth/react";
import { CssBaseline, CssVarsProvider } from "@mui/joy";

export default function App({ Component, pageProps }) {
  return (
    <CssBaseline>
      <CssVarsProvider defaultMode="system">
        <SessionProvider session={pageProps.session}>
          <Component {...pageProps} />
        </SessionProvider>
      </CssVarsProvider>
    </CssBaseline>
  );
}
