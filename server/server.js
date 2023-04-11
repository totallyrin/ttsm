/**
 * server-side code
 */
const { spawn } = require('child_process');
const { exec } = require('child_process');
const WebSocket = require('ws');

const wss = new WebSocket.Server({port: 8080});
// set WebSocket on global object
global.WebSocket = require('ws');

const ps = require('ps-node');
const {kill} = require("ps-node");

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
                    console.error(`exec error: ${error}`);
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

                    console.log('Minecraft server killed');
                });
            });
            break;
        case 'terraria':
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
    console.log('sending server statuses to client');
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

/**
 * code to run on new client connection
 */
wss.on('connection', (ws) => {
    console.log('Client connected');

    // send server status to webpage
    // console.log('sending server statuses to client');
    updateStatuses(ws, 0);
    updateStatuses(ws, 10);
    // ws.send(JSON.stringify({type: 'serverState', game: 'minecraft', running: minecraftServerRunning}));

    // when message is received from client:
    ws.on('message', async (message) => {
        // get message data
        const data = JSON.parse(message);

        if (data.type === 'startStop') {
            switch (data.game) {
                case 'minecraft':
                    // if server is running, send stop command
                    if (minecraftServerRunning) {
                        minecraftServer.stdin.write('/stop\n');
                        minecraftServerRunning = false;
                    // if server is not running,
                    } else {
                        // kill unknown servers
                        if (minecraftServer === undefined) {
                            await killServer('minecraft');
                            minecraftServerRunning = false;
                        }

                        setTimeout(() => {
                            console.log('waiting');
                            // start a new server
                            process.chdir('game_servers\\minecraft');
                            minecraftServer = spawn('java', ['-Xmx1024M', '-Xms1024M', '-jar', 'server.jar', 'nogui']);
                            minecraftServerRunning = true;
                            process.chdir('..\\..');

                            minecraftServer.stdout.on('data', (data) => {
                                console.log(`Minecraft server: ${data}`);
                                ws.send(data);
                            });

                            minecraftServer.stderr.on('data', (data) => {
                                console.error(`Minecraft server: ${data}`);
                                ws.send(data);
                            });

                            minecraftServer.on('close', (code) => {
                                console.log(`Minecraft server exited with code ${code}`);
                                minecraftServerRunning = false;
                            });
                        }, 10 * 1000);


                    }
                    // send server status to webpage
                    console.log('sending minecraft server status to client');
                    ws.send(JSON.stringify({type: 'serverState', game: 'minecraft', running: minecraftServerRunning}));
                    break;
                case 'terraria':
                    if (terrariaServerRunning) {
                        terrariaServer.kill();
                    } else {
                        terrariaServer = spawn('TerrariaServer.exe', ['-config', 'serverconfig.txt']);
                        terrariaServerRunning = true;

                        terrariaServer.stdout.on('data', (data) => {
                            console.log(`Terraria server: ${data}`);
                            ws.send(data);
                        });

                        terrariaServer.stderr.on('data', (data) => {
                            console.error(`Terraria server: ${data}`);
                            ws.send(data);
                        });

                        terrariaServer.on('close', (code) => {
                            console.log(`Terraria server exited with code ${code}`);
                            terrariaServerRunning = false;
                        });
                    }
                    break;
            }
        }
    });
});