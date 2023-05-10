import { useRef, useState } from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import {Alert, Box, Button, CssBaseline, FormControl, FormLabel, Input, Link, Sheet, Typography} from '@mui/joy';
import Footer from '../components/footer';
import { getSession, signIn } from 'next-auth/react';
import Head from "next/head";

export default function LoginPage() {
    const [isClicked, setClicked] = useState(false);
    const [isError, setError] = useState(false);
    const [isSuccess, setSuccess] = useState(false);
    const username = useRef('');
    const password = useRef('');

    return (
        <CssBaseline>
            <CssVarsProvider defaultMode="system">
                <Head>
                    <meta charSet="UTF-8" />
                    <title>TTSM - Login</title>
                </Head>
                <Sheet sx={{
                    display: 'grid',
                    gridTemplateColumns: 'auto',
                    gridTemplateRows: 'auto 1fr auto',
                    minHeight: '100vh', // set min-height to ensure the layout takes up the full height of the viewport
                    minWidth: 'fit-content',
                }}>
                    <Sheet
                        variant="outlined"
                        sx={{
                            width: 'auto',
                            mx: 4, // margin left & right
                            // my: 4, // margin top & bottom
                            mt: 4,
                            py: 3, // padding top & bottom
                            px: 3, // padding left & right
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                            borderRadius: 'sm',
                            boxShadow: 'md',
                        }}
                    >

                        <div>
                            <Typography level="h4" component="h1">
                                Welcome!
                            </Typography>
                            <Typography level="body2">Sign in to continue.</Typography>
                        </div>

                        {isError && (<Alert color="danger" variant="solid">
                            Please enter a valid username and password.
                        </Alert>)}

                        {isSuccess && (<Alert color="success" variant="solid" invertedColors>
                            Correct username and password!
                        </Alert>)}

                        <FormControl>
                            <FormLabel>Username</FormLabel>
                            <Input
                                required
                                // html input attribute
                                name="username"
                                type="username"
                                placeholder="username"
                                onChange={(event) => {
                                    username.current = event.target.value;
                                }}
                                onSubmit={(event) => {
                                    event.preventDefault();
                                }}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Password</FormLabel>
                            <Input
                                required
                                name="password"
                                type="password"
                                placeholder="password"
                                onChange={(event) => {
                                    password.current = event.target.value;
                                }}
                                onSubmit={(event) => {
                                    event.preventDefault();
                                }}
                            />
                        </FormControl>


                        <Button
                            disabled={isClicked}
                            sx={{ mt: 1 /* margin top */ }}
                            onClick={async (e) => {
                                setClicked(true);
                                if (username.current !== '' && password.current !== '') {
                                    e.preventDefault()

                                    const result = await signIn('credentials', {
                                        username: username.current,
                                        password: password.current,
                                        // redirect: false,
                                        callbackUrl: '/home'
                                    });

                                    await result;

                                    if (result?.ok) {
                                        const session = await getSession();
                                        console.log(session?.user?.name);
                                        setSuccess(true);
                                    }

                                }
                                else setError(true);
                                setClicked(false);
                            }}
                        >{isClicked ? 'Logging in...' : 'Log in'}</Button>
                        <Typography
                             // TODO: implement sign-up page and functionality
                            endDecorator={<Link href="/sign-up">Sign up</Link>}
                            fontSize="sm"
                            sx={{ alignSelf: 'center' }}
                        />

                    </Sheet>
                    {/* Box component below is an empty placeholder to force footer to bottom of page */}
                    <Box />
                    <Footer />
                </Sheet>
            </CssVarsProvider>
        </CssBaseline>
    );
}
