import {Button, Link, List, ListItem, Typography} from "@mui/joy";
import {useEffect} from "react";
import * as React from "react";

function LogoutButton() {
    useEffect(() => {
        // this code only runs on the client-side
        localStorage.removeItem("isLoggedIn");
    }, []);

    return (
        <Link href="/login">
            <Button variant="soft">
                Log out
            </Button>
        </Link>
    );
}

interface NavbarProps {
    username: string;
}

export default function Navbar(props: NavbarProps) {
    return (
        <List
            orientation="horizontal"
            variant="outlined"
            sx={{
                width: 'auto',
                mx: 4, // margin left & right
                my: 4, // margin top & bottom
                py: 1, // padding top & bottom
                px: 1, // padding left & right
                borderRadius: 'sm',
                boxShadow: 'sm',
                flexGrow: 0,
                display: 'flex',
                justifyContent: 'space-between',
                '--ListItemDecorator-size': '48px',
                '--ListItem-paddingY': '1rem',
            }}
        >
            <ListItem>
                <LogoutButton />
            </ListItem>
            <ListItem>
                <ListItem>
                    <Typography level="h4" component="h1">
                        {props.username !== '' ? `Welcome, ${props.username}!` : 'Welcome!'}
                    </Typography>
                </ListItem>
            </ListItem>
            <ListItem>
                <Link href={`/account/${props.username}`}>
                    <Button variant="soft">
                        Account
                    </Button>
                </Link>
            </ListItem>
        </List>
    );
}

