import { useRouter } from 'next/router'
import {useEffect, useState} from "react";
import {url} from "../../utils/utils";
import useServerList from "../../utils/useServerList";
import Layout from "../../components/layout";
import {Alert, Button, FormControl, FormLabel, Input, Sheet, Typography, useTheme} from "@mui/joy";
import {getSession, useSession} from "next-auth/react";
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

function EditLogin({ username, property, onChange }) {
    const { data: session, update } = useSession();
    const [ oldProperty, setOldProperty ] = useState(username);
    const [ newProperty, setNewProperty ] = useState(username);
    const [ isClicked, setClicked ] = useState(false);
    const [ isError, setError ] = useState(false);
    const [ isSuccess, setSuccess ] = useState(false);
    const [ws, setWs] = useState<WebSocket | null>(null);
    const [ user, setUser ] = useState(username);

    // open single websocket
    useEffect(() => {
        const ws = new WebSocket(url);
        setWs(ws);
        // receive messages from server
        ws.onmessage = async function (event) {
            // get data from message
            const data = JSON.parse(event.data);
            if (data.type === 'saveUser') {
                if (data.success) {
                    setSuccess(true);
                    if (property === 'username') {
                        await update({username: newProperty});
                        setUser(newProperty);
                        onChange(newProperty);
                    }
                } else {
                    setError(true);
                }
            }
        };
    }, [username, newProperty]);

    const changeProperty = (event) => {
        event.preventDefault();
        // send command to server
        if (ws) {
            setUser(newProperty);
            onChange(newProperty);
            ws.send(JSON.stringify({ type: 'change', property: property, username: user, password: oldProperty, new: newProperty }));
        }
    };

    const theme = useTheme();

    return (
        <Sheet variant="outlined" sx={{
            p: 4,
            borderRadius: 'sm',
            boxShadow: 'sm',
        }}>
            <form onSubmit={e => e.preventDefault()}>
                <Sheet sx={{
                    overflowY: 'auto',
                    display: 'grid',
                    gridTemplateColumns: 'auto',
                    gridTemplateRows: (isError || isSuccess ? 'auto 1fr auto' : '1fr auto'),
                    gridRowGap: theme.spacing(2),
                    alignItems: 'center',
                }}>
                    {isError && (<Alert color="danger" variant="solid">
                        An error occurred; cannot change {`${property}`}.
                    </Alert>)}

                    {isSuccess && (<Alert color="success" variant="solid">
                        {`${property}`} changed successfully!
                    </Alert>)}

                    <Sheet>
                        <FormControl>
                            <FormLabel sx={{ pl: 1 }}>Current password</FormLabel>
                            <Input
                                name="curr-prop"
                                type={"password"}
                                placeholder={`Current password`}
                                onChange={(event) => {
                                    setError(false);
                                    setSuccess(false);
                                    setOldProperty(event.target.value);
                                }}
                                onSubmit={(event) => {
                                    event.preventDefault();
                                    setError(false);
                                    setSuccess(false);
                                }}
                            />
                        </FormControl>
                        <FormControl sx={{ mt: 2 }}>
                            <FormLabel sx={{ pl: 1 }}>New {`${property}`}</FormLabel>
                            <Input
                                name="new-prop"
                                type={property === 'username' ? "username" : "password"}
                                placeholder={`New ${property}`}
                                onChange={(event) => {
                                    setNewProperty(event.target.value);
                                    setError(false);
                                    setSuccess(false);
                                }}
                                onSubmit={(event) => {
                                    event.preventDefault();
                                    setError(false);
                                    setSuccess(false);
                                }}
                            />
                        </FormControl>
                    </Sheet>


                    <Button
                        type="submit"
                        disabled={isClicked}
                        sx={{ width: '100%', mt: 6 /* margin top */ }}
                        onClick={async (e) => {
                            setClicked(true);
                            setError(false);
                            setSuccess(false);
                            if (oldProperty.current !== '' && newProperty.current !== '') {
                                changeProperty(e);
                            }
                            setClicked(false);
                        }}
                    >Change {`${property}`}</Button>
                </Sheet>
            </form>
        </Sheet>
    );
}

export default function User({ username }) {
    const router = useRouter();
    const { user } = router.query;

    const [ storedUsername, setStoredUsername ] = useState(username);

    const handleUsernameChange = (newUsername) => {
        setStoredUsername(newUsername);
    }

    const [ serverList, setServerList] = useState<string[]>([]);
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
            <Layout username={storedUsername} page={`Account`} serverList={serverList}>
                <Sheet sx={{
                    display: 'grid',
                    gridTemplateColumns: '1fr',
                    gridTemplateRows: 'auto 1fr 1fr',
                    gridRowGap: theme.spacing(4),
                }}>
                    <Sheet variant="outlined" sx={{
                        p: 4,
                        borderRadius: 'sm',
                        boxShadow: 'sm',
                        display: 'flex',
                        justifyContent: 'center',
                    }}>
                        <Typography level="h3">{`${storedUsername}`}</Typography>
                    </Sheet>
                    <EditLogin username={storedUsername} property="username" onChange={handleUsernameChange}/>
                    <EditLogin username={storedUsername} property="password" onChange={handleUsernameChange}/>
                </Sheet>
            </Layout>
        ));
    }, [serverList, storedUsername]);

    return page;
}