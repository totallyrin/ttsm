import { useRouter } from 'next/router'
import {useEffect, useState} from "react";
import {url} from "../../utils/utils";
import useServerList from "../../utils/useServerList";
import Layout from "../../components/layout";
import {Button, List, ListItem, Sheet, Textarea, Typography, useTheme} from "@mui/joy";
import Console from "../../components/console";
import {getSession} from "next-auth/react";
import * as React from "react";

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

    const username = session.user?.name ? session.user.name : '';

    return {
        props: {
            username: username,
        },
    };
}

export default function User({ username }) {
    const router = useRouter()
    const { game } = router.query

    const [ws, setWs] = useState<WebSocket | null>(null);

    // open single websocket
    useEffect(() => {
        const websocket = (new WebSocket(url));
        setWs(websocket);

        websocket.onopen = () => {
            websocket.send(JSON.stringify({ type: 'username', username: username }));
        };
        // receive messages from server
        websocket.onmessage = function (message) {
            // get data from message
            const data = JSON.parse(message.data);
            // if message is about server status, update relevant status
            if (data.type === 'serverState') {
                setRunningList(prevRunningList => {
                    let temp = {...prevRunningList};
                    temp[data.game] = data.running;
                    return temp;
                });
            }
            if (data.type === 'debug') console.log(data.msg);
        };

        websocket.onclose = () => {
            console.log('websocket was closed');
        }
    }, []);

    const [serverList, setServerList] = useState<string[]>([]);
    const retrievedServers = useServerList();

    // get server list
    useEffect(() => {
        if (retrievedServers) setServerList(retrievedServers);
    }, [retrievedServers]);

    const [runningList, setRunningList] = useState({});
    // initialize server statuses
    useEffect(() => {
        if (serverList) {
            let temp = {};
            serverList.forEach(function (game) {
                temp[game] = 'pinging';
            });
            setRunningList(temp);
        }
    }, [serverList]);

    const [page, setPage] = useState<JSX.Element>((
        <Layout username={username} page={'Home'} serverList={serverList}>
            <Sheet sx={{
                display: 'grid',
                gridTemplateColumns: 'auto',
                gridTemplateRows: 'auto',
                minHeight: '100%', // set min-height to ensure the layout takes up the full height of the viewport
                minWidth: 'fit-content',
            }}>
                <Typography level="h3">Loading...</Typography>
            </Sheet>
        </Layout>
    ));

    const theme = useTheme();

    useEffect(() => {
        // @ts-ignore
        setPage ((
            <Layout username={username} page={`Account`} serverList={serverList}>
                <Sheet sx={{
                    display: 'grid',
                    gridTemplateColumns: '1fr',
                    gridTemplateRows: 'auto 1fr 1fr',
                    gridRowGap: theme.spacing(4),
                }}>
                    {/*// TODO: display username, add components to change username and password */}
                </Sheet>
            </Layout>
        ));
    }, [ws, serverList, runningList]);

    return page;
}