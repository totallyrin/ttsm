


const ws = new WebSocket('ws://localhost:443');

// Read the "game" query parameter from the URL
const urlParams = new URLSearchParams(window.location.search);
const game = urlParams.get('game');

// Display different content based on the "game" query parameter
if (game !== undefined) {
    document.getElementById('config').textContent = `${game === 'pz' ?
        'Project Zomboid' : game.charAt(0).toUpperCase() + game.slice(1)} Server`;
}
else {
    document.getElementById('config').innerHTML = '<p>Invalid game specified in URL.</p>';
}

if (!localStorage.getItem('isLoggedIn')) {
    // redirect users to login page if not logged in
    window.location.assign('..\\index.html');
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
