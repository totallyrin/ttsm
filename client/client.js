/**
 * client code
 */

/**
 * function to update all server statuses on page load
 */
function serverInit() {
    // TODO: implement this
}

/**
 * function responsible for handling starting/stopping of servers, executed on button press
 *
 * @param game the game to be started/stopped
 */
function startStop(game) {
    let status = document.getElementById((game + '-status'));
    let button = document.getElementById((game + '-button'));
    // if online, turn off
    if (status.classList.contains('online')) {
        // update status class
        status.classList.remove('online');
        status.classList.add('offline');
        // update status text
        status.innerText = 'offline';
        // update button text
        button.innerText = 'start';
    }
    // if offline, turn on
    else if (status.classList.contains('offline')) {
        status.classList.remove('offline');
        status.classList.add('online');
        // update status text
        status.innerText = 'online';
        // update button text
        button.innerText = 'stop';
    }
    else {
        // initialize server statuses
        // TODO: get status from machine and upload
    }
}