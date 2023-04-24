/**
 * login code
 */

const ws = new WebSocket('ws://localhost:443');

const loginForm = document.getElementById('login-form');
const loginButton = document.getElementById('login-button');
const loginErrorMsg = document.getElementById('login-error-msg-holder');

/**
 * function to toggle password visibility
 */
function togglePassword() {
    let x = document.getElementById('password');
    if (x.type === 'password') {
        x.type = 'text';
    } else {
        x.type = 'password';
    }
}

/**
 *  login function on login button press
 */
loginButton.addEventListener('click', async (e) => {
    e.preventDefault();

    // // Open the database
    // const db = new sqlite3.Database('users.db', (err) => {
    //     if (err) {
    //         console.error(err.message);
    //     }
    //     console.log('Connected to the database.');
    // });

    const username = loginForm.username.value;
    const password = loginForm.password.value;

    ws.send(JSON.stringify({type: 'login', username: username, password: password}));

    // if (username && password) {
    //     // Query the database for the user
    //     db.get(`SELECT * FROM users WHERE username = ? AND password = ?`, [username, await hash(password)], (err, row) => {
    //         if (err) {
    //             console.error(err.message);
    //         }
    //         else if (!row) {
    //             loginErrorMsg.classList.add('showing');
    //         }
    //         else {
    //             // User exists and password is correct
    //             window.location.assign('client/home.html');
    //             localStorage.setItem('isLoggedIn', true);
    //         }
    //     });
    // }
    // else {
    //     // Invalid input
    //     loginErrorMsg.classList.add('showing');
    // }
    //
    // // Close the database
    // db.close((err) => {
    //     if (err) {
    //         console.error(err.message);
    //     }
    //     console.log('Closed the database connection.');
    // });
});

function addUser(username, password) {
    ws.send(JSON.stringify({type: 'addUser', username: username, password: password}));
}

/**
 * hide login error on focus
 */
function hideLoginError() {
    loginErrorMsg.classList.remove('showing');
}

// receive messages from server
ws.onmessage = function (event) {
    // get data from message
    const data = JSON.parse(event.data);
    // wait for login success message
    if (data.type === 'login') {
        if (data.success) {
            // User exists and password is correct
            window.location.assign('client/home.html');
            localStorage.setItem('isLoggedIn', true);
        }
        else {
            // Invalid input
            loginErrorMsg.classList.add('showing');
            loginErrorMsg.innerText = data.error;
        }
    }
};
