import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Layout from '../../components/layout';
import Head from "next/head";
import {List} from "@mui/joy";
import {useEffect, useState} from "react";
import getServerList from "../../utils/serverlist";
import {getSession, useSession} from "next-auth/react";

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

export default function Game({ page, props }) {
    const router = useRouter();
    const { game } = router.query;
    const ws = new WebSocket('ws://localhost:443');
    const serverList = getServerList(ws);

    const session = useSession();
    const [username, setUsername] = useState<string>('');
    // setup username updates
    useEffect(() => {
        if (session.data && session.data.user && session.data.user.name) {
            setUsername(session.data.user.name);
        }
    }, [session]);


    // render the page with the configuration data for the game server
    return (
        <Layout username={username} page={page} props={props} serverList={serverList}>
            <List id="server-list"
                  variant="outlined"
                  sx={{
                      width: 'auto',
                      height: '100%',
                      mx: 4, // margin left & right
                      my: 4, // margin top & bottom
                      // py: 1, // padding top & bottom
                      px: 1, // padding left & right
                      bgcolor: 'background.body',
                      borderRadius: 'sm',
                      boxShadow: 'sm',
                      flexGrow: 0,
                      display: 'inline-flex',
                      // justifyContent: 'space-between',
                      '--ListItemDecorator-size': '48px',
                      '--ListItem-paddingY': '1rem',
                  }}>
                {/*{serverList.map((game) => (*/}
                {/*    <ServerListItem key={game} game={game} ws={ws}/>*/}
                {/*))}*/}
            </List>
        </Layout>
    );
}
