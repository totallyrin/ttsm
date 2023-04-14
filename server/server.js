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

// const games = ['minecraft', 'terraria', 'valheim', 'pz'];
const servers = {
    minecraft: minecraft,
    terraria: terraria,
    valheim: valheim,
    pz: pz
};

// let minecraftServer;
// let minecraftServerRunning = false;

// let terrariaServer;
// let terrariaServerRunning = false;

// let valheimServer;
// let valheimServerRunning = false;

// let pzServer;
// let pzServerRunning = false;

// let servers = {
//     minecraft: undefined,
//     terraria: undefined,
//     valheim: undefined,
//     pz: undefined
// };
//
// let running = {
//     minecraft: false,
//     terraria: false,
//     valheim: false,
//     pz: false
// };

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
function killServer(game) {
    return new Promise((resolve, reject) => {
        switch (game) {
            // minecraft
            case 'minecraft':
                // Find the process ID of the Minecraft server
                exec('tasklist | find "java.exe"', (error, stdout, stderr) => {
                    if (error) {
                        // console.error(`exec error: ${error}`);
                        console.error('could not find any unknown minecraft servers');
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

                        console.log('unknown minecraft servers killed');
                        resolve();
                    });
                });
                break;
            case 'terraria':
                // Find the process ID of the Minecraft server
                exec('tasklist | find "TerrariaServer.exe"', (error, stdout, stderr) => {
                    if (error) {
                        // console.error(`exec error: ${error}`);
                        console.error('could not find any unknown terraria servers');
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

                        console.log('unknown terraria servers killed');
                        resolve();
                    });
                });
                break;
            case 'valheim':
                // Find the process ID of the Minecraft server
                exec('tasklist | find "valheim_server.exe"', (error, stdout, stderr) => {
                    if (error) {
                        // console.error(`exec error: ${error}`);
                        console.error('could not find any unknown valheim servers');
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
            case 'pz':
                break;
        }
    });
}

/**
 * function to send server status updates a single time
 *
 * @param ws web server for messaging
 */
function updateStatusesOnce(ws) {
    // console.log('sending server statuses to client');
    // minecraft
    ws.send(JSON.stringify({type: 'serverState', game: 'minecraft', running: minecraft.running}));
    // terraria
    ws.send(JSON.stringify({type: 'serverState', game: 'terraria', running: terraria.running}));
    // valheim
    ws.send(JSON.stringify({type: 'serverState', game: 'valheim', running: valheim.running}));
    // project zomboid
    ws.send(JSON.stringify({type: 'serverState', game: 'pz', running: pz.running}));
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

function updateStatus(ws, game, status) {
    servers[game].running = status;
    updateStatusesOnce(ws);
}

/**
 * code to run on new client connection
 */
wss.on('connection', (ws) => {
    console.log('client connected');

    // send server status to webpage
    updateStatusesOnce(ws);

    // when message is received from client:
    ws.on('message', async (message) => {
        // get message data
        const data = JSON.parse(message);

        if (data.type === 'startStop') {
            switch (data.game) {
                case 'minecraft':
                    // if server is running, send stop command
                    if (minecraft.running) {
                        console.log('attempting to stop minecraft server');
                        try {
                            minecraft.server.stdin.write('/stop\n');
                        }
                        catch (e) {
                            console.log('could not stop minecraft server safely; attempting to kill');
                            try {
                                minecraft.server.kill();
                            }
                            catch (e) {
                                console.log('could not kill minecraft server');
                            }
                        }
                    }
                    // if server is not running,
                    else {
                        updateStatus(ws, 'minecraft', 'pinging');

                        // kill unknown servers
                        await killServer('minecraft');

                        console.log('starting minecraft server');
                        // start a new server
                        process.chdir('game_servers\\minecraft');
                        minecraft.server = spawn('java', ['-Xmx1024M', '-Xms1024M', '-jar', 'server.jar', 'nogui']);
                        process.chdir('..\\..');

                        minecraft.server.stdout.on('data', (data) => {
                            if (data !== ('\n' || '\r')) {
                                console.log(`Minecraft server: ${data.toString().trim()}`);
                                if (data.includes('Done'))
                                    updateStatus(ws, 'minecraft', true);
                                if (data.includes('Stopping the server'))
                                    updateStatus(ws, 'minecraft', 'pinging');
                                // ws.send(data);
                            }
                        });

                        minecraft.server.stderr.on('data', (data) => {
                            console.error(`Minecraft server: ${data.trim()}`);
                            // ws.send(data);
                        });

                        minecraft.server.on('close', (code) => {
                            console.log(`Minecraft server exited with code ${code}`);
                            updateStatus(ws, 'minecraft', false);
                        });
                    }
                    break;
                case 'terraria':
                    // if server is running, send stop command
                    if (terraria.running) {
                        console.log('attempting to stop terraria server');
                        try {
                            terraria.server.write('exit\r');
                        }
                        catch (e) {
                            console.log('could not stop terraria server safely; attempting to kill');
                            try {
                                terraria.server.kill();
                            }
                            catch (e) {
                                console.log('could not kill terraria server');
                            }
                        }
                    }
                    // if server is not running,
                    else {
                        updateStatus(ws, 'terraria', 'pinging');

                        // kill unknown servers
                        await killServer('terraria');

                        console.log('starting terraria server');
                        // start a new server
                        process.chdir('game_servers\\terraria');
                        terraria.server = pty.spawn(shell, ['.\\start-server.bat'], {
                            name: 'TerrariaServer',
                            cwd: process.env.PWD,
                            env: process.env
                        });
                        process.chdir('..\\..');

                        terraria.server.onData((data) => {
                            if (data !== ('\n' || '\r' || '\\\n')) {
                                console.log(`Terraria server: ${data.trim()}`);
                                if (data.includes('Server started'))
                                    updateStatus(ws, 'terraria', true);
                                if (data.includes('Saving before exit...'))
                                    updateStatus(ws, 'terraria', false);
                            }
                        });

                        terraria.server.onExit((data) => {
                            console.log(`Terraria server exited with code ${data.exitCode}`);
                            updateStatus(ws, 'terraria', false);
                        });
                    }
                    break;
                case 'valheim':
                    // if server is running, send stop command
                    if (valheim.running) {
                        console.log('attempting to stop valheim server');
                        try {
                            // send CTRL+C to stop server
                            valheim.server.write('\x03');
                            updateStatus(ws, 'valheim', false);
                        }
                        catch (e) {
                            console.log('could not stop server; attempting to kill')
                            try {
                                valheim.server.kill();
                                updateStatus(ws, 'valheim', false);
                            }
                            catch (e) {
                                console.log('could not kill valheim server');
                            }
                        }
                    }
                    // if server is not running,
                    else {
                        updateStatus(ws, 'valheim', 'pinging');

                        // kill unknown servers
                        await killServer('valheim');

                        console.log('starting valheim server');
                        // start a new server
                        process.chdir('game_servers\\valheim');
                        valheim.server = pty.spawn(shell, ['.\\start_server.bat'], {
                            name: 'ValheimServer',
                            cwd: process.env.PWD,
                            env: process.env
                        });
                        process.chdir('..\\..');

                        valheim.server.onData((data) => {
                            if (data !== ('\n' || '\r' || '\\\n')) {
                                console.log(`Valheim server: ${data.trim()}`);
                                if (data.includes('Game server connected'))
                                    updateStatus(ws, 'valheim', true);
                                if (data.includes('Terminate batch job (Y/N)?')) {
                                    valheim.server.write('Y');
                                    updateStatus(ws, 'valheim', false);
                                }
                            }
                        });

                        valheim.server.onExit((data) => {
                            console.log(`Valheim server exited with code ${data.exitCode}`);
                            updateStatus(ws, 'valheim', false);
                        });
                    }
                    break;
                case 'pz':
                    break;
            }
        }
    });
});