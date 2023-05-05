import * as React from 'react';
import { CssVarsProvider, useColorScheme } from '@mui/joy/styles';
import { CssBaseline, Sheet, Typography} from '@mui/joy';
import { FormControl, FormLabel, Input } from '@mui/joy';
import { Button, Link } from '@mui/joy';
import Footer from '../components/footer';

export default function LoginPage() {
    return (
        <CssBaseline>
            <CssVarsProvider defaultMode="system">
                <Sheet
                    variant="outlined"
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


                    <Button
                        sx={{ mt: 1 /* margin top */ }}
                        onClick={() => {
                            // TODO: implement login function
                        }}
                    >Log in</Button>
                    <Typography
                        {/* TODO: implement sign-up page and functionality */}
                        endDecorator={<Link href="/sign-up">Sign up</Link>}
                        fontSize="sm"
                        sx={{ alignSelf: 'center' }}
                    />

                </Sheet>

                <Footer />
            </CssVarsProvider>
        </CssBaseline>
    );
}
