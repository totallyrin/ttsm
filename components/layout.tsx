import Navbar from './navbar';
import Footer from './footer';
import {getSession} from "next-auth/react";
import { CssBaseline, CssVarsProvider } from "@mui/joy";

export async function getServerSideProps(context) {
    const session = await getSession(context);

    if (!session) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        };
    }

    return {
        props: {
            user: session?.user?.name,
        },
    };
}

export default function Layout({ props, children }) {
    return (
        <CssBaseline>
            <CssVarsProvider defaultMode="system">
                <Navbar username={props?.user ? props.user : ''} />
                <main>{children}</main>
                <Footer />
            </CssVarsProvider>
        </CssBaseline>
    );
}