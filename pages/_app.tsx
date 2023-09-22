import * as React from "react";
import { SessionProvider } from "next-auth/react";
import { CssBaseline, CssVarsProvider, extendTheme } from "@mui/joy";

const theme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {},
        neutral: {},
        danger: {},
        success: {},
        warning: {},
      },
    },
    dark: {
      palette: {
        background: {},
        primary: {
          plainColor: "var(--joy-palette-primary-500, #0B6BCB)",
        },
        neutral: {},
        danger: {
          plainColor: "var(--joy-palette-danger-500, #C41C1C)",
        },
        success: {
          plainColor: "var(--joy-palette-success-500, #1F7A1F)",
        },
        warning: {
          plainColor: "var(--joy-palette-warning-500, #9A5B13)",
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
