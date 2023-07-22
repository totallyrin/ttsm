import { useRef, useState } from "react";
import { CssVarsProvider } from "@mui/joy/styles";
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
import Footer from "../components/Footer";
import { signIn } from "next-auth/react";
import Head from "next/head";

export default function LoginPage() {
  const [isClicked, setClicked] = useState(false);
  const [isError, setError] = useState(false);
  const username = useRef("");
  const password = useRef("");

  return (
    <CssBaseline>
      <CssVarsProvider defaultMode="system">
        <Head>
          <meta charSet="UTF-8" />
          <title>TTSM - Login</title>
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
              <Typography level="body2">Sign in to continue.</Typography>
            </Sheet>

            {isError && (
              <Alert color="danger" variant="solid">
                Please enter a valid username and password.
              </Alert>
            )}

            <form onSubmit={(e) => e.preventDefault()}>
              <FormControl>
                <FormLabel sx={{ pl: 1 }}>Username</FormLabel>
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
              <FormControl sx={{ mt: 2 }}>
                <FormLabel sx={{ pl: 1 }}>Password</FormLabel>
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
                sx={{ width: "100%", mt: 4 /* margin top */ }}
                onClick={async (e) => {
                  setClicked(true);
                  if (username.current !== "" && password.current !== "") {
                    e.preventDefault();

                    const t0 = performance.now();
                    const result = await signIn("credentials", {
                      username: username.current,
                      password: password.current,
                      // redirect: false,
                      callbackUrl: "/home",
                    });
                    const t1 = performance.now();
                    console.log(`Login in ${t1 - t0}ms`);

                    await result;

                    // if (result?.ok) {
                    //     const session = await getSession();
                    //     console.log(session?.user?.name);
                    // }
                  } else setError(true);
                  setClicked(false);
                }}
              >
                {isClicked ? "Logging in..." : "Log in"}
              </Button>
            </form>
            <Typography
              // TODO: implement sign-up page and functionality
              endDecorator={<Link href="/sign-up">Sign up</Link>}
              fontSize="sm"
              sx={{ alignSelf: "center" }}
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
