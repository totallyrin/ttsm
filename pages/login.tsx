import * as React from 'react';
import { CssVarsProvider, useColorScheme } from '@mui/joy/styles';
import {CssBaseline, Sheet, Typography} from '@mui/joy';
import { FormControl, FormLabel, Input } from '@mui/joy';
import { Button, Link } from '@mui/joy';

function ModeToggle() {
    const { mode, setMode } = useColorScheme();
    const [mounted, setMounted] = React.useState(false);

    // necessary for server-side rendering
    // because mode is undefined on the server
    React.useEffect(() => {
        setMounted(true);
    }, []);
    if (!mounted) {
        return null;
    }

    return (
        <Button
            variant="outlined"
            onClick={() => {
                setMode(mode === 'light' ? 'dark' : 'light');
            }}>
            {mode === 'light' ? 'Dark mode' : 'Light mode'}
        </Button>
    );
}

export default function LoginPage() {
    return (
        <CssBaseline>
            <CssVarsProvider defaultMode="system">
                <Sheet
                    sx={{
                        width: 'auto',
                        mx: 4, // margin left & right
                        my: 4, // margin top & bottom
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

                    <FormControl>
                        <FormLabel>Email</FormLabel>
                        <Input
                            // html input attribute
                            name="email"
                            type="email"
                            placeholder="johndoe@email.com"
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Password</FormLabel>
                        <Input
                            name="password"
                            type="password"
                            placeholder="password"
                        />
                    </FormControl>

                    <Button sx={{ mt: 1 /* margin top */ }}>Log in</Button>
                    <Typography
                        endDecorator={<Link href="/sign-up">Sign up</Link>}
                        fontSize="sm"
                        sx={{ alignSelf: 'center' }}
                    >
                    </Typography>

                    <footer style={{ textAlign: "center" }}>
                        <ModeToggle />
                    </footer>

                </Sheet>
            </CssVarsProvider>
        </CssBaseline>
    );
}
