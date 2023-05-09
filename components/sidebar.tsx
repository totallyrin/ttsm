import {useEffect, useState} from 'react';
import {Sheet, List, ListItem, Typography, Link, Button, IconButton, ListItemButton} from '@mui/joy';
import {
    Code,
    HomeRounded,
    KeyboardArrowDown,
    SportsEsportsRounded
} from '@mui/icons-material';
import * as React from "react";

function ServerListItem({ game }) {
    const gameName = game === 'pz' ? 'Project Zomboid' : game.charAt(0).toUpperCase() + game.slice(1);

    return (
        <ListItem nested>
            <Link href="/" sx={{ width: '100%' }}>
                <Button variant="plain" sx={{ width: '100%', justifyContent: 'flex-start' }}>
                    <Typography
                        level="body3"
                        sx={{ textTransform: 'uppercase' }}>
                        {gameName}
                    </Typography>
                </Button>
            </Link>
        </ListItem>
    );
}

export default function Sidebar({ serverList }) {
    const [serversOpen, setServersOpen] = useState(false);

    return (
        <List
            variant="outlined"
            sx={{
                width: 'auto',
                // height: 'auto',
                // mx: 4, // margin left & right
                // my: 4, // margin top & bottom
                mr: 4,
                py: 1, // padding top & bottom
                px: 1, // padding left & right
                borderRadius: 'sm',
                boxShadow: 'sm',
                flexGrow: 0,
                display: 'inline-flex',
                flexDirection: 'column',
                // justifyContent: 'space-between',
                '--ListItemDecorator-size': '48px',
                // '--ListItem-paddingY': '1rem',
        }}>
            <ListItem>
                <Typography
                    level="body3"
                    // startDecorator={<Code />}
                    sx={{ textTransform: 'uppercase', width: '100%' }}>
                    TTSM - Totally Terrible Server Manager
                </Typography>
            </ListItem>
            <ListItem sx={{ width: '100%' }}>
                <Link href="/home" sx={{ width: '100%' }}>
                    <Button variant="plain" startDecorator={<HomeRounded />} sx={{ width: '100%', justifyContent: 'flex-start' }}>
                        <Typography level="body3" sx={{ textTransform: 'uppercase' }}>
                            Home
                        </Typography>
                    </Button>
                </Link>
            </ListItem>
            <ListItem>
                <Link href="/" sx={{ width: '100%' }}>
                    <Button variant="plain" startDecorator={<SportsEsportsRounded />} sx={{ width: '100%', justifyContent: 'flex-start' }}>
                        <Typography
                            level="body3"
                            sx={{ textTransform: 'uppercase' }}>
                            Servers
                        </Typography>
                    </Button>
                </Link>
            </ListItem>
            <ListItem>
                <Button
                    variant="plain"
                    startDecorator={
                        <KeyboardArrowDown
                            sx={{ transform: serversOpen ? 'initial' : 'rotate(-90deg)' }}
                        />}
                    sx={{ width: '100%', justifyContent: 'flex-start' }}
                    onClick={() => setServersOpen(!serversOpen)}
                >
                    <Typography
                        level="body3"
                        sx={{
                            textTransform: 'uppercase',
                            fontWeight: serversOpen ? 'bold' : undefined,
                            // color: serversOpen ? 'text.primary' : 'inherit',
                        }}
                    >
                        Servers
                    </Typography>
                </Button>

                {serversOpen && (
                    <List
                        sx={{
                            width: 'auto',
                            height: '100%',
                            mx: 4, // margin left & right
                            my: 4, // margin top & bottom
                            // py: 1, // padding top & bottom
                            px: 1, // padding left & right
                            flexGrow: 0,
                            display: 'block',
                            // flexDirection: 'column',
                            // justifyContent: 'space-between',
                            '--ListItemDecorator-size': '48px',
                            '--ListItem-paddingY': '1rem',
                        }}>
                        {serverList.map((game) => (
                            <ServerListItem game={game} />
                        ))}
                    </List>
                )}
            </ListItem>
        </List>
    );
}
