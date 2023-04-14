/**
 * client code
 */

const ws = new WebSocket('ws://localhost:8080');

const minecraftButton = document.getElementById('minecraft-button'),
    terrariaButton = document.getElementById('terraria-button'),
    valheimButton = document.getElementById('valheim-button'),
    pzButton = document.getElementById('pz-button');

/**
 * function responsible for updating game statuses, given message from server.js
 *
 * @param data from wss
 */
function updateStatuses(data) {
    let game = data.game;
    let status = document.getElementById((game + '-status'));
    let button = document.getElementById((game + '-button'));
    if (data.running === 'pinging') {
        button.disabled = true;
        button.innerText = '...';
        status.textContent = 'pinging';
        status.classList.remove('online');
        status.classList.remove('offline');
        status.classList.add('status');
    }
    else {
        button.disabled = false;
        button.innerText = data.running ? 'stop' : 'start';
        status.textContent = data.running ? 'online' : 'offline';
        if (data.running) {
            status.classList.remove('offline');
            status.classList.add('online');
        } else {
            status.classList.remove('online');
            status.classList.add('offline');
        }
        status.classList.remove('status');
    }
}

/**
 * function responsible for handling messages received from server.js
 *
 * @param event message that was sent
 */
// receive messages from server
ws.onmessage = function (event) {
    // get data from message
    const data = JSON.parse(event.data);
    // if message is about server status, call update function
    if (data.type === 'serverState') {
        updateStatuses(data);
    } else {
        document.getElementById('console').textContent += event.data;
    }
};

// send messages to start and stop server based on button press
// minecraft
minecraftButton.onclick = () => {
    ws.send(JSON.stringify({ type: 'startStop', game: 'minecraft' }));
};

// terraria
terrariaButton.onclick = () => {
    ws.send(JSON.stringify({ type: 'startStop', game: 'terraria' }));
};

// valheim
valheimButton.onclick = () => {
    ws.send(JSON.stringify({ type: 'startStop', game: 'valheim' }));
};

// project zomboid
pzButton.onclick = () => {
    ws.send(JSON.stringify({ type: 'startStop', game: 'pz' }));
};
