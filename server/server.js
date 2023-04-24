/**
 * server-side code
 */
const { spawn } = require('child_process');
const { exec } = require('child_process');

const WebSocket = require('ws');
const wss = new WebSocket.Server({port: 443});
global.WebSocket = require('ws');

const os = require('os');
const pty = require('node-pty');
const shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';

const { startBot } = require('../discord/discord.js');
const { deploy } = require("../discord/deploy-commands");

const clients = new Set();

const crypto = require('crypto');
const sqlite3 = require('sqlite3').verbose();

let minecraft = {
    server: undefined,
    running: false
};

let terraria = {
    server: undefined,
    running: false
};

let valheim = {
    server: undefined,
    running: false
};

let pz = {
    server: undefined,
    running: false
};

exports.servers = {
    minecraft: minecraft,
    terraria: terraria,
    valheim: valheim,
    pz: pz
};

/**
 * password hashing function
 *
 * @param password
 * @returns {Promise<string>}
 */
async function hash(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hash));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * function to add a new user to the database
 *
 * @param username
 * @param password
 * @returns {Promise<void>}
 */
async function addUser(username, password) {
    console.log(`creating user ${username}`)
    // Open the database
    const db = await new sqlite3.Database('users.db', (err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Connected to the database.');
    });

    // create the users table if it doesn't exist
    await db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
        );
    `);

    // insert the new user into the database
    await db.run('INSERT INTO users (username, password) VALUES (?, ?)', username, await hash(password), function (err) {
        if (err) throw err;
        console.log(`User '${username}' added to database.`);
    });

    // Close the database
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Closed the database connection.');
    });
}

/**
 * login function, authenticates user given credentials
 *
 * @param ws websocket (user sending request)
 * @param username
 * @param password
 * @returns {Promise<void>}
 */
async function login(ws, username, password) {
    // Open the database
    const db = new sqlite3.Database('users.db', (err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Connected to the database.');
    });

    // const username = loginForm.username.value;
    // const password = loginForm.password.value;

    if (username && password) {
        // Query the database for the user
        await db.get(`SELECT * FROM users WHERE username = ? AND password = ?`, [username, await hash(password)], (err, row) => {
            if (err) {
                console.error(err.message);
            }
            else if (!row) {
                ws.send(JSON.stringify({type: 'login', success: false, error: 'Incorrect username or password'}));
            }
            else {
                // User exists and password is correct
                ws.send(JSON.stringify({type: 'login', success: true}));
            }
        });
    }
    else {
        // Invalid input
        ws.send(JSON.stringify({type: 'login', success: false, error: 'Incorrect username or password'}));
    }

    // Close the database
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Closed the database connection.');
    });
}

/**
 * function to kill all foreign game servers
 *
 * @returns {Promise<void>}
 */
async function killAll() {
    for (const game in exports.servers) {
        await killServer(game);
    }
}

/**
 * function to kill a given foreign game server
 *
 * @param game
 * @returns {Promise<void>}
 */
function killServer(game) {
    return new Promise((resolve, reject) => {
        console.log(game)
        switch (game) {
            // java-based servers
            case 'pz':
            case 'minecraft':
                // Find the process ID of the Minecraft server
                exec('tasklist | find "java.exe"', (error, stdout, stderr) => {
                    if (error) {
                        // console.error(`exec error: ${error}`);
                        console.error(`could not find any unknown ${game} servers`);
                        // reject(error);
                        resolve();
                        return;
                    }

                    // Extract the process ID from the output
                    const pid = stdout.trim().split(/\s+/)[1];

                    // Kill the process
                    exec(`taskkill /F /PID ${pid}`, (error, stdout, stderr) => {
                        if (error) {
                            console.error(`exec error: ${error}`);
                            reject(error);
                        }

                        console.log('unknown servers killed');
                        resolve();
                    });
                });
                break;
            case 'valheim':
            case 'terraria':
                // Find the process ID of the Minecraft server
                exec(`tasklist | find "${game.charAt(0).toUpperCase() + game.slice(1)}Server.exe"`, (error, stdout, stderr) => {
                    if (error) {
                        // console.error(`exec error: ${error}`);
                        console.error(`could not find any unknown ${game} servers`);
                        // reject(error);
                        resolve();
                        return;
                    }

                    // Extract the process ID from the output
                    const pid = stdout.trim().split(/\s+/)[1];

                    // Kill the process
                    exec(`taskkill /F /PID ${pid}`, (error, stdout, stderr) => {
                        if (error) {
                            console.error(`exec error: ${error}`);
                            reject(error);
                        }

                        console.log('unknown servers killed');
                        resolve();
                    });
                });
                break;
        }
    });
}

/**
 * function to start a server
 *
 * @param ws websocket to send status updates over
 * @param game server to start
 * @param cmd start command
 * @param args start arguments
 * @param stop stop command
 * @param online online confirmation phrase
 * @param offline offline confirmation phrase
 * @returns {Promise<void>}
 */
async function startServer(ws, game, cmd, args, stop, online, offline) {
    // if server is running, send stop command
    if (exports.servers[game].running) {
        console.log(`attempting to stop ${game} server`);
        try {
            exports.servers[game].server.stdin.write(stop);
        } catch (e) {
            console.log(`could not stop ${game} server safely; attempting to kill`);
            try {
                exports.servers[game].server.kill();
            } catch (e) {
                console.log(`could not kill ${game} server`);
            }
        }
    }
    // if server is not running,
    else {
        updateStatus(ws, game, 'pinging');

        // kill unknown servers
        await killServer(game);

        console.log(`starting game server`);
        // start a new server
        process.chdir(`game_servers\\${game}`);
        exports.servers[game].server = spawn(cmd, args);
        process.chdir('..\\..');

        exports.servers[game].server.stdout.on('data', (data) => {
            if (data !== ('\n' || '\r')) {
                console.log(`${game.charAt(0).toUpperCase() + game.slice(1)} server: ${data.toString().trim()}`);
                if (data.includes(online))
                    updateStatus(ws, game, true);
                if (data.includes(offline))
                    updateStatus(ws, game, 'pinging');
                // ws.send(JSON.stringify(`${game.charAt(0).toUpperCase() + game.slice(1)} server: ${data.toString().trim()}\n`));
                sendAll(`${game.charAt(0).toUpperCase() + game.slice(1)} server: ${data.toString().trim()}\n`);
            }
        });

        exports.servers[game].server.stderr.on('data', (data) => {
            console.error(`${game.charAt(0).toUpperCase() + game.slice(1)} server: ${data.trim()}`);
            ws.send(JSON.stringify(`${game.charAt(0).toUpperCase() + game.slice(1)} server: ${data.trim()}\n`));
        });

        exports.servers[game].server.on('close', (code) => {
            console.log(`${game.charAt(0).toUpperCase() + game.slice(1)} server exited with code ${code}`);
            updateStatus(ws, game, false);
        });
    }
}

/**
 * function to start a server using node-pty
 *
 * @param ws websocket to send status updates over
 * @param game server to start
 * @param args start arguments
 * @param stop stop command
 * @param online online confirmation phrase
 * @param offline offline confirmation phrase
 * @returns {Promise<void>}
 */
async function startServerPTY(ws, game, args, stop, online, offline) {
    // if server is running, send stop command
    if (exports.servers[game].running) {
        console.log(`attempting to stop ${game} server`);
        try {
            exports.servers[game].server.write(stop);
        }
        catch (e) {
            console.log(`could not stop ${game} server safely; attempting to kill`);
            try {
                exports.servers[game].server.kill();
            }
            catch (e) {
                console.log(`could not kill ${game} server`);
            }
        }
    }
    // if server is not running,
    else {
        updateStatus(ws, game, 'pinging');

        // kill unknown servers
        await killServer(game);

        console.log(`starting ${game} server`);
        // start a new server
        process.chdir(`game_servers\\${game}`);
        exports.servers[game].server = pty.spawn(shell, args, {
            name: `${game === 'pz' ? 'PZ' : game.charAt(0).toUpperCase() + game.slice(1)}Server`,
            cwd: process.env.PWD,
            env: process.env
        });
        process.chdir('..\\..');

        exports.servers[game].server.onData((data) => {
            if (!data.includes('[K')) {
                if (data.charAt(0) !== ('\n' || '\r' || '\\\n' || ' ')) {
                    console.log(`${game === 'pz' ? 'PZ' : game.charAt(0).toUpperCase() + game.slice(1)} server: ${data.trim()}`);
                    if (data.includes(online))
                        updateStatus(ws, game, true);
                    if (data.includes(offline)) {
                        updateStatus(ws, game, 'pinging');
                    }
                    if (data.includes('Terminate batch job (Y/N)?')) {
                        exports.servers[game].server.write('Y');
                        updateStatus(ws, game, false);
                    }
                }
                // ws.send(JSON.stringify(`${game === 'pz' ? 'PZ' : game.charAt(0).toUpperCase() + game.slice(1)} server: ${data.trim()}\n`));
                sendAll(`${game === 'pz' ? 'PZ' : game.charAt(0).toUpperCase() + game.slice(1)} server: ${data.trim()}\n`);
            }
        });

        exports.servers[game].server.onExit((data) => {
            console.log(`${game.charAt(0).toUpperCase() + game.slice(1)} server exited with code ${data.exitCode}`);
            updateStatus(ws, game, false);
        });
    }
}

/**
 * function to send server status updates for all servers
 *
 * @param ws web server for messaging
 */
function updateAll(ws) {
    for (const server in exports.servers) {
        ws.send(JSON.stringify({type: 'serverState', game: server, running: exports.servers[server].running}));
    }
}

/**
 * function to send server status updates
 *
 * @param ws web server for messaging
 * @param game game to update
 * @param status status to update to
 */
function updateStatus(ws, game, status) {
    exports.servers[game].running = status;
    ws.send(JSON.stringify({type: 'serverState', game: game, running: exports.servers[game].running}));
}

function sendAll(data) {
    for (const client of clients) {
        client.send(JSON.stringify(data));
    }
}

// main code below
console.log('starting discord bot');
deploy();
startBot();

/**
 * code to run on new client connection
 */
wss.on('connection', (ws) => {
    console.log('client connected');
    clients.add(ws);

    // send server list to client
    for (const game in exports.servers) {
        ws.send(JSON.stringify({type: 'serverList', name: game.toString()}));
    }

    // send server status to webpage
    updateAll(ws);

    // start loop so that webpage status is updated
    setInterval(() => {
        updateAll(ws);
    }, 0.5 * 1000);

    // when message is received from client:
    ws.on('message', async (message) => {
        // get message data
        const data = JSON.parse(message);

        if (data.type === 'startStop') {
            switch (data.game) {
                case 'minecraft':
                    await startServer(ws, data.game, 'java', ['-Xmx1024M', '-Xms1024M', '-jar', 'server.jar', 'nogui'], '/stop\n', 'Done', 'Stopping the server');
                    break;
                case 'terraria':
                    await startServerPTY(ws, data.game, ['.\\start-server.bat'], 'exit\r', 'Server started', 'Saving before exit...');
                    break;
                case 'valheim':
                    await startServerPTY(ws, data.game, ['.\\start-server.bat'], '\x03', 'Game server connected', 'World save writing');
                    break;
                case 'pz':
                    await startServerPTY(ws, data.game, ['.\\start-server.bat'], 'quit\r', 'Server Steam ID', 'QuitCommand');
                    break;
            }
            updateAll(ws);
        }
        if (data.type === 'console') {
            // enable console
            if (data.enabled) {

            }
            // disable console
            else {

            }
        }
        if (data.type === 'login') {
            // if username and password not given, throw error
            if (!(data.username && data.password)) {
                ws.send(JSON.stringify({type: 'login', success: false, error: 'Invalid username or password'}));
            }
            else {
                await login(ws, data.username, data.password);
            }
        }
        if (data.type === 'addUser') {
            await addUser(data.username, data.password);
        }
    });
});