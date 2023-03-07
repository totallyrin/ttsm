const loginForm = document.getElementById("login-form");
const loginButton = document.getElementById("login-button");
const loginErrorMsg = document.getElementById("login-error-msg-holder");

loginButton.addEventListener("click", (e) => {
    e.preventDefault();
    const username = loginForm.username.value;
    const password = loginForm.password.value;

    if (username === "user" && password === "pass") {
        alert("You have successfully logged in.");
        location.reload();
    } else {
        // loginErrorMsg.style.opacity = 1;
        loginErrorMsg.toggle('showing')
    }
})