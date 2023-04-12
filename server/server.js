/**
 * server-side code
 */
const { spawn } = require('child_process');
const { exec } = require('child_process');
const WebSocket = require('ws');

const wss = new WebSocket.Server({port: 8080});
global.WebSocket = require('ws');

const os = require('os');
const pty = require('node-pty');
const shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';

const games = ['minecraft', 'terraria', 'valheim', 'pz'];

let minecraftServer;
let minecraftServerRunning = false;

let terrariaServer;
let terrariaServerRunning = false;

let valheimServer;
let valheimServerRunning = false;

let pzServer;
let pzServerRunning = false;

/**
 * function to kill all foreign game servers
 *
 * @returns {Promise<void>}
 */
async function killAll() {
    for (const game in games) {
        await killServer(game);
    }
}

/**
 * function to kill a given foreign game server
 *
 * @param game
 * @returns {Promise<void>}
 */
async function killServer(game) {
    switch (game) {
        // minecraft
        case 'minecraft':
            // Find the process ID of the Minecraft server
            exec('tasklist | find "java.exe"', (error, stdout, stderr) => {
                if (error) {
                    // console.error(`exec error: ${error}`);
                    console.error('could not find any foreign minecraft servers');
                    return;
                }

                // Extract the process ID from the output
                const pid = stdout.trim().split(/\s+/)[1];

                // Kill the process
                exec(`taskkill /F /PID ${pid}`, (error, stdout, stderr) => {
                    if (error) {
                        console.error(`exec error: ${error}`);
                        return;
                    }

                    console.log('minecraft servers killed');
                });
            });
            break;
        case 'terraria':
            // Find the process ID of the Minecraft server
            exec('tasklist | find "TerrariaServer.exe"', (error, stdout, stderr) => {
                if (error) {
                    // console.error(`exec error: ${error}`);
                    console.error('could not find any foreign terraria servers');
                    return;
                }

                // Extract the process ID from the output
                const pid = stdout.trim().split(/\s+/)[1];

                // Kill the process
                exec(`taskkill /F /PID ${pid}`, (error, stdout, stderr) => {
                    if (error) {
                        console.error(`exec error: ${error}`);
                        return;
                    }

                    console.log('terraria servers killed');
                });
            });
            break;
        case 'valheim':
            break;
        case 'pz':
            break;
    }
}

/**
 * function to send server status updates a single time
 *
 * @param ws web server for messaging
 */
function updateStatusesOnce(ws) {
    // console.log('sending server statuses to client');
    // minecraft
    ws.send(JSON.stringify({type: 'serverState', game: 'minecraft', running: minecraftServerRunning}));
    // terraria
    ws.send(JSON.stringify({type: 'serverState', game: 'terraria', running: terrariaServerRunning}));
    // valheim
    ws.send(JSON.stringify({type: 'serverState', game: 'valheim', running: valheimServerRunning}));
    // project zomboid
    ws.send(JSON.stringify({type: 'serverState', game: 'pz', running: pzServerRunning}));
}

/**
 * function to send server status updates every @param secs seconds
 *
 * @param ws web server for messaging
 * @param secs interval, in seconds
 */
function updateStatuses(ws, secs) {
    if (secs > 0) {
        setInterval(() => {
            updateStatusesOnce(ws);
        }, secs * 1000);
    }
    else {
        updateStatusesOnce(ws);
    }
}

let stdinStream;

/**
 * code to run on new client connection
 */
wss.on('connection', (ws) => {
    console.log('Client connected');

    // send server status to webpage
    updateStatusesOnce(ws);
    updateStatuses(ws, 3);

    // when message is received from client:
    ws.on('message', async (message) => {
        // get message data
        const data = JSON.parse(message);

        if (data.type === 'startStop') {
            switch (data.game) {
                case 'minecraft':
                    // if server is running, send stop command
                    if (minecraftServerRunning !== false) {
                        console.log('attempting to stop minecraft server');
                        minecraftServer.stdin.write('/stop\n');
                        // minecraftServer.stdin.end();
                    }
                    // if server is not running,
                    else {
                        // kill unknown servers
                        if (minecraftServer === undefined) {
                            console.log('attempting to kill foreign minecraft servers');
                            await killServer('minecraft');
                            minecraftServerRunning = false;
                        }

                        minecraftServerRunning = 'pinging';

                        setTimeout(() => {
                            console.log('starting minecraft server');
                            // start a new server
                            process.chdir('game_servers\\minecraft');
                            minecraftServer = spawn('java', ['-Xmx1024M', '-Xms1024M', '-jar', 'server.jar', 'nogui']);
                            // minecraftServerRunning = true;
                            process.chdir('..\\..');

                            minecraftServer.stdout.on('data', (data) => {
                                if (data !== ('\n' || '\r')) {
                                    console.log(`Minecraft server: ${data.trim()}`);
                                    if (data.includes('Done'))
                                        minecraftServerRunning = true;
                                    // ws.send(data);
                                }
                            });

                            minecraftServer.stderr.on('data', (data) => {
                                console.error(`Minecraft server: ${data.trim()}`);
                                // ws.send(data);
                            });

                            minecraftServer.on('close', (code) => {
                                console.log(`Minecraft server exited with code ${code}`);
                                minecraftServerRunning = false;
                            });
                        }, 10 * 1000);
                    }
                    break;
                case 'terraria':
                    // if server is running, send stop command
                    if (terrariaServerRunning !== false) {
                        console.log('attempting to stop terraria server');
                        terrariaServer.write('exit\r');
                        setTimeout(() => {
                            if (!terrariaServerRunning)
                                terrariaServer.kill();
                        }, 5 * 1000);
                    }
                    // if server is not running,
                    else {
                        // kill unknown servers
                        if (terrariaServer === undefined) {
                            console.log('attempting to kill foreign terraria servers');
                            await killServer('terraria');
                            terrariaServerRunning = false;
                        }

                        terrariaServerRunning = 'pinging';

                        setTimeout(() => {
                            console.log('starting terraria server');
                            // start a new server
                            process.chdir('game_servers\\terraria');
                            terrariaServer = pty.spawn(shell, ['.\\start-server.bat'], {
                                name: 'TerrariaServer',
                                cwd: process.env.PWD,
                                env: process.env
                            });
                            process.chdir('..\\..');

                            terrariaServer.onData((data) => {
                                if (data !== ('\n' || '\r' || '\\\n')) {
                                    console.log(`Terraria server: ${data.trim()}`);
                                    if (data.includes('Server started'))
                                        terrariaServerRunning = true;
                                    if (data.includes('Saving before exit...'))
                                        terrariaServerRunning = false;
                                }
                            });

                            terrariaServer.onExit((data) => {
                                console.log(`Terraria server exited with code ${data.exitCode}`);
                                terrariaServerRunning = false;
                            });

                        }, 10 * 1000);
                    }
                    break;
            }
        }
    });
});