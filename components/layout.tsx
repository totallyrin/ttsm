import Navbar from './navbar';
import Footer from './footer';
import { useState } from 'react';
import { getSession } from 'next-auth/react';
import {CssBaseline, CssVarsProvider, Box, Tabs, TabList, Tab, TabPanel, tabClasses, Sheet} from '@mui/joy';
import Sidebar from "./sidebar";
import Head from "next/head";

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

export default function Layout({ props, page, serverList, children }) {
    const colors = ['primary', 'info', 'danger', 'success'] as const;

    return (
        <CssBaseline>
            <CssVarsProvider defaultMode="system">
                <Head>
                    <meta charSet="UTF-8" />
                    <title>TTSM - {page}</title>
                </Head>
                <Sheet sx={{
                    display: 'grid',
                    gridTemplateColumns: 'auto',
                    gridTemplateRows: 'auto 1fr auto',
                    minHeight: '100vh', // set min-height to ensure the layout takes up the full height of the viewport
                    minWidth: 'fit-content',
                }}>
                    <Navbar username={props?.user ? props.user : ''} />
                    <Sheet sx={{
                        display: 'grid',
                        gridTemplateColumns: 'auto 1fr',
                        minWidth: 'fit-content',
                        px: 4,
                    }}>
                        <Sidebar serverList={serverList} />
                        <Sheet sx={{ height: 'fit-content', minWidth: 'fit-content' }}>{children}</Sheet>
                    </Sheet>
                    <Footer />
                </Sheet>
            </CssVarsProvider>
        </CssBaseline>
    );
}