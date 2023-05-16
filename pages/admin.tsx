import {getSession} from "next-auth/react";
import * as React from "react";
import {useEffect, useState} from "react";
import useServerList from "../utils/useServerList";
import Layout from "../components/layout";
import {url} from '../utils/utils';
import {Alert, Button, FormControl, FormLabel, Input, Sheet, Typography, useTheme} from "@mui/joy";

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

    // @ts-ignore
    const role = session.role;

    if (role !== 'admin') {
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
            role: role,
        },
    };
}

export default function Admin({username, role}) {
    const [ws, setWs] = useState<WebSocket | null>(null);
    const [serverList, setServerList] = useState<string[]>([]);
    const retrievedServers = useServerList();

    const [addUsername, setAddUsername] = useState('');
    const [addPassword, setAddPassword] = useState('password');
    const [addRole, setAddRole] = useState('user');
    const [addError, setAddError] = useState(false);
    const [addSuccess, setAddSuccess] = useState(false);
    const [addIsClicked, setAddIsClicked] = useState(false);

    const [delUsername, setDelUsername] = useState('');
    const [delError, setDelError] = useState(false);
    const [delSuccess, setDelSuccess] = useState(false);
    const [delIsClicked, setDelIsClicked] = useState(false);

    const [editUsername, setEditUsername] = useState('');
    const [editRole, setEditRole] = useState('user');
    const [editError, setEditError] = useState(false);
    const [editSuccess, setEditSuccess] = useState(false);
    const [editIsClicked, setEditIsClicked] = useState(false);

    // open single websocket
    useEffect(() => {
        const websocket = (new WebSocket(url));
        setWs(websocket);

        websocket.onopen = () => {
            websocket.send(JSON.stringify({type: 'username', username: username}));
        };
        // receive messages from server
        websocket.onmessage = function (message) {
            // get data from message
            const data = JSON.parse(message.data);
            switch (data.type) {
                case 'addUser':
                    data.success ? setAddSuccess(true) : setAddError(true);
                    break;
                case 'delUser':
                    data.success ? setDelSuccess(true) : setDelError(true);
                    break;
                case 'editUser':
                    data.success ? setEditSuccess(true) : setEditError(true);
                    break;
            }
        };

        websocket.onclose = () => {
            console.log('websocket was closed');
        }
    }, []);

    // get server list
    useEffect(() => {
        if (retrievedServers) setServerList(retrievedServers);
    }, [retrievedServers]);

    const [page, setPage] = useState<JSX.Element>((
        <Layout username={username} role={role} page={'Home'} serverList={serverList}>
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
        setPage((
            <Layout username={username} role={role} page={`Account`} serverList={serverList}>
                <Sheet sx={{
                    display: 'grid',
                    gridTemplateColumns: '1fr',
                    gridTemplateRows: 'auto 1fr 1fr',
                    gridRowGap: theme.spacing(4),
                }}>
                    {/* add user */}
                    <Sheet variant="outlined" sx={{
                        p: 4,
                        borderRadius: 'sm',
                        boxShadow: 'sm',
                        display: 'grid',
                    }}>
                        <Typography level="h4" sx={{
                            alignSelf: 'center',
                            mb: 1,
                        }}>Add user</Typography>

                        {addError && (<Alert color="danger" variant="solid">
                            An error occurred; cannot add user {`${addUsername}`}.
                        </Alert>)}

                        {addSuccess && (<Alert color="success" variant="solid">
                            User '{`${addUsername}`}' added successfully!
                        </Alert>)}

                        <form onSubmit={e => e.preventDefault()}>
                            <FormControl sx={{mt: 2}}>
                                <FormLabel sx={{pl: 1}}>Username</FormLabel>
                                <Input
                                    name="username"
                                    type="username"
                                    placeholder="username"
                                    onChange={(event) => {
                                        console.log(event.target.value);
                                        setAddUsername(event.target.value);
                                        setAddError(false);
                                        setAddSuccess(false);
                                    }}
                                    onSubmit={(event) => {
                                        event.preventDefault();
                                        setAddError(false);
                                        setAddSuccess(false);
                                    }}
                                />
                            </FormControl>

                            <FormControl sx={{mt: 2}}>
                                <FormLabel sx={{pl: 1}}>Password</FormLabel>
                                <Input
                                    name="password"
                                    type="password"
                                    placeholder="password"
                                    onChange={(event) => {
                                        setAddPassword(event.target.value);
                                        setAddError(false);
                                        setAddSuccess(false);
                                    }}
                                    onSubmit={(event) => {
                                        event.preventDefault();
                                        setAddError(false);
                                        setAddSuccess(false);
                                    }}
                                />
                            </FormControl>

                            <FormControl sx={{mt: 2}}>
                                <FormLabel sx={{pl: 1}}>Role</FormLabel>
                                <Input
                                    name="role"
                                    type="role"
                                    placeholder="user"
                                    onChange={(event) => {
                                        setAddRole(event.target.value);
                                        setAddError(false);
                                        setAddSuccess(false);
                                    }}
                                    onSubmit={(event) => {
                                        event.preventDefault();
                                        setAddError(false);
                                        setAddSuccess(false);
                                    }}
                                />
                            </FormControl>

                            <Button
                                type="submit"
                                disabled={addIsClicked}
                                sx={{width: '100%', mt: 6 /* margin top */}}
                                onClick={async (e) => {
                                    console.log(addUsername);
                                    setAddIsClicked(true);
                                    setAddError(false);
                                    setAddSuccess(false);
                                    if (addUsername !== '') {
                                        e.preventDefault();
                                        // send command to server
                                        if (ws) {
                                            console.log();
                                            ws.send(JSON.stringify({
                                                type: 'addUser',
                                                username: addUsername,
                                                password: addPassword,
                                                role: addRole
                                            }));
                                        } else {
                                            const websocket = (new WebSocket(url));

                                            websocket.onopen = async () => {
                                                await websocket.send(JSON.stringify({
                                                    type: 'addUser',
                                                    username: addUsername,
                                                    password: addPassword,
                                                    role: addRole
                                                }));

                                                websocket.close();
                                            };

                                        }
                                    }
                                    setAddIsClicked(false);
                                }}
                            >Add user</Button>
                        </form>
                    </Sheet>
                    {/* delete user */}
                    <Sheet variant="outlined" sx={{
                        p: 4,
                        borderRadius: 'sm',
                        boxShadow: 'sm',
                        display: 'grid',
                    }}>
                        <Typography level="h4" sx={{
                            alignSelf: 'center',
                            mb: 1,
                        }}>Delete user</Typography>

                        {delError && (<Alert color="danger" variant="solid">
                            An error occurred; cannot delete user {`${delUsername}`}.
                        </Alert>)}

                        {delSuccess && (<Alert color="success" variant="solid">
                            User '{`${delUsername}`}' deleted successfully!
                        </Alert>)}

                        <form onSubmit={e => e.preventDefault()}>
                            <FormControl sx={{mt: 2}}>
                                <FormLabel sx={{pl: 1}}>Username</FormLabel>
                                <Input
                                    name="username"
                                    type="username"
                                    placeholder="username"
                                    onChange={(event) => {
                                        setDelUsername(event.target.value);
                                        setDelError(false);
                                        setDelSuccess(false);
                                    }}
                                    onSubmit={(event) => {
                                        event.preventDefault();
                                        setDelError(false);
                                        setDelSuccess(false);
                                    }}
                                />
                            </FormControl>

                            <Button
                                type="submit"
                                disabled={delIsClicked}
                                sx={{width: '100%', mt: 6 /* margin top */}}
                                onClick={async (e) => {
                                    setDelIsClicked(true);
                                    setDelError(false);
                                    setDelSuccess(false);
                                    if (addUsername !== '') {
                                        e.preventDefault();
                                        // send command to server
                                        if (ws) {
                                            ws.send(JSON.stringify({
                                                type: 'delUser',
                                                username: delUsername,
                                            }));
                                        }
                                        else {
                                            const websocket = (new WebSocket(url));

                                            websocket.onopen = () => {
                                                websocket.send(JSON.stringify({
                                                    type: 'delUser',
                                                    username: delUsername,
                                                }));
                                            };

                                            websocket.close();
                                        }
                                    }
                                    setDelIsClicked(false);
                                }}
                            >Add user</Button>
                        </form>
                    </Sheet>
                </Sheet>
            </Layout>
        ));
    }, [serverList, ws]);

    return page;
}
