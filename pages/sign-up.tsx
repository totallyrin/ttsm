import {useRef, useState} from "react";
import {CssVarsProvider} from "@mui/joy/styles";
import {
    Alert,
    Box,
    Button,
    CssBaseline,
    FormControl,
    FormLabel,
    Input,
    Link,
    Sheet,
    Typography,
} from "@mui/joy";
import Footer from "../components/footer";
import Head from "next/head";
import {url} from "../utils/utils";
import {useRouter} from "next/router";

async function attempt_signup(
    username,
    password
): Promise<boolean> {
    const ws = new WebSocket(url);

    return await new Promise((resolve, reject) => {
        let result, user, signupPromise;
        const t0 = performance.now();
        ws.addEventListener("open", async () => {
            const t1 = performance.now();
            console.log(`WebSocket connection opened in ${t1 - t0}ms`);
            ws.send(
                JSON.stringify({
                    type: "addUser",
                    username: username,
                    password: password,
                    role: "no-auth",
                })
            );

            signupPromise = new Promise((resolve) => {
                const t2 = performance.now();
                ws.onmessage = function (event) {
                    // get data from message
                    const data = JSON.parse(event.data);
                    // wait for signup success message
                    if (data.type === "addUser") {
                        const t3 = performance.now();
                        console.log(`Server responded in ${t3 - t2}ms`);
                        if (data.success) {
                            // User created successfully
                            resolve(true);
                        } else {
                            // User could not be created
                            resolve(false);
                        }
                        result = data.success;
                    }
                };
            });

            const res = await signupPromise;
            ws.close();
            resolve(res);
        });

        ws.addEventListener("error", (event) => {
            console.log(event);
            reject(new Error("There was an error connecting to the webSocketServer"));
        });

        setTimeout(() => {
            reject(new Error("The connection timed out"));
        }, 5000);
    });
}

export default function LoginPage() {
    const [isClicked, setClicked] = useState(false);
    const [isError, setError] = useState(false);
    const username = useRef("");
    const password = useRef("");
    const router = useRouter();

    return (
        <CssBaseline>
            <CssVarsProvider defaultMode="system">
                <Head>
                    <meta charSet="UTF-8"/>
                    <title>TTSM - Sign Up</title>
                </Head>
                <Sheet
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "auto",
                        gridTemplateRows: "auto 1fr auto",
                        minHeight: "100vh", // set min-height to ensure the layout takes up the full height of the viewport
                        minWidth: "fit-content",
                    }}
                >
                    <Sheet
                        variant="outlined"
                        sx={{
                            width: "auto",
                            mx: 4, // margin left & right
                            mt: 4,
                            py: 3, // padding top & bottom
                            px: 3, // padding left & right
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                            borderRadius: "sm",
                            boxShadow: "md",
                        }}
                    >
                        <Sheet>
                            <Typography level="h4" component="h1">
                                Welcome!
                            </Typography>
                            <Typography level="body2">Sign up to
                                continue.</Typography>
                        </Sheet>

                        {isError && (
                            <Alert color="danger" variant="solid">
                                Could not create account. That username is
                                already taken.
                            </Alert>
                        )}

                        <form onSubmit={(e) => e.preventDefault()}>
                            <FormControl>
                                <FormLabel sx={{pl: 1}}>Username</FormLabel>
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
                            <FormControl sx={{mt: 2}}>
                                <FormLabel sx={{pl: 1}}>Password</FormLabel>
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
                                type="submit"
                                disabled={isClicked}
                                sx={{width: "100%", mt: 4 /* margin top */}}
                                onClick={async (e) => {
                                    setClicked(true);
                                    if (username.current !== "" && password.current !== "") {
                                        e.preventDefault();

                                        const t0 = performance.now();
                                        const result = await attempt_signup(username.current, password.current);
                                        const t1 = performance.now();
                                        console.log(`User created in ${t1 - t0}ms`);

                                        if (result) {
                                            await router.push('/login');
                                        }
                                    } else setError(true);
                                    setClicked(false);
                                }}
                            >
                                {isClicked ? "Creating account..." : "Sign up"}
                            </Button>
                        </form>
                        <Typography
                            endDecorator={<Link
                                href="/login">Login</Link>}
                            fontSize="sm"
                            sx={{alignSelf: "center"}}
                        />
                    </Sheet>
                    {/* Box component below is an empty placeholder to force footer to bottom of page */}
                    <Box/>
                    <Footer/>
                </Sheet>
            </CssVarsProvider>
        </CssBaseline>
    );
}
