import '../styles/style.css';
import * as React from "react";
import {SessionProvider} from "next-auth/react";

export default function App({ Component, pageProps }) {
    return (
        <SessionProvider session={pageProps.session}>
            <Component {...pageProps} />
        </SessionProvider>
    );
}
