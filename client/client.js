/**
 * client code
 */

const ws = new WebSocket('ws://localhost:443');

/**
 * add server to webpage
 *
 * @param game game server to add
 */
function addServer(game) {
    const serverList = document.getElementById('server-list');
    const server = document.createElement('li');
    server.innerHTML = `
        <li><div id="${game}" class="games">
            <img src="../img/${game}.png" alt="${game}">
            <a href="./server-config.html?game=${game}" class="server-link" data-game="${game}">${game === 'pz' ?
                                            'Project Zomboid' : game.charAt(0).toUpperCase() + game.slice(1)}</a>
            <p id="${game}-status" class="status">pinging</p>
            <button id="${game}-button">on/off</button>
        </div></li>`;

    serverList.append(server);

    // add button functionality
    document.getElementById(`${game}-button`).onclick = () => {
        ws.send(JSON.stringify({ type: 'startStop', game: game }));
    };
}

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

if (!localStorage.getItem('isLoggedIn')) {
    // redirect users to login page if not logged in
    window.location.assign('..\\index.html');
}
else {
    document.getElementById('user').innerText = localStorage.getItem('username');
}

ws.onopen = function (event) {
    const username = localStorage.getItem('username');
    ws.send(JSON.stringify({type: 'username', username: username}));
}

// receive messages from server
ws.onmessage = function (event) {
    // get data from message
    const data = JSON.parse(event.data);
    // if message is about server status, call update function
    switch (data.type) {
        case 'serverState':
            updateStatuses(data);
            break;
        case 'serverList':
            addServer(data.name);
            break;
        default:
            let console = document.getElementById('console');
            console.textContent += data;
            console.scrollTop = console.scrollHeight;
    }
};
