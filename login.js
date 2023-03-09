/**
 * login code
 */

const loginForm = document.getElementById("login-form");
const loginButton = document.getElementById("login-button");
const loginErrorMsg = document.getElementById("login-error-msg-holder");

/**
 * function to toggle password visibility
 */
function togglePassword() {
    let x = document.getElementById("password");
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
}

/**
 *  login function on login button press
 */
loginButton.addEventListener("click", (e) => {
    e.preventDefault();
    const username = loginForm.username.value;
    const password = loginForm.password.value;

    // TODO: password hashing?
    if (username === "user" && password === "pass") {
        // alert("You have successfully logged in.");
        // location.reload();
        location.assign("client/home.html");
    } else {
        loginErrorMsg.classList.add('showing');
    }
})

/**
 * hide login error on focus
 */
function hideLoginError() {
    loginErrorMsg.classList.remove('showing');
}