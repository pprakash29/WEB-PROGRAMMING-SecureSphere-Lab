// =========================
// LOGIN
// =========================

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const message = document.getElementById("message");
        const button = document.getElementById("loginBtn");

        button.textContent = "Logging in...";
        button.disabled = true;

        try {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            const data = await response.json();

            if (data.success) {
                message.textContent = "✅ Login successful!";
                message.style.color = "#4ade80";

                sessionStorage.setItem("userEmail", data.email);

                setTimeout(() => {
                    window.location.href = "dashboard.html";
                }, 700);

            } else {
                message.textContent = "❌ " + data.message;
                message.style.color = "#f87171";

                button.textContent = "Login";
                button.disabled = false;
            }

        } catch (error) {
            console.error(error);

            message.textContent = "❌ Unable to connect to server.";
            message.style.color = "#f87171";

            button.textContent = "Login";
            button.disabled = false;
        }
    });
}


// =========================
// SHOW / HIDE PASSWORD
// =========================

const togglePassword = document.getElementById("togglePassword");

if (togglePassword) {
    togglePassword.addEventListener("click", function () {

        const password = document.getElementById("password");

        if (password.type === "password") {
            password.type = "text";
            togglePassword.textContent = "🙈";
        } else {
            password.type = "password";
            togglePassword.textContent = "👁";
        }

    });
}


// =========================
// SIGN UP
// =========================

const signupForm = document.getElementById("signupForm");

if (signupForm) {
    signupForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = document.getElementById("signupEmail").value.trim();
        const password = document.getElementById("signupPassword").value;

        const message = document.getElementById("signupMessage");
        const button = signupForm.querySelector("button");

        button.textContent = "Creating Account...";
        button.disabled = true;

        try {
            const response = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            const data = await response.json();

            if (data.success) {

                message.textContent =
                    "✅ Account created successfully!";

                message.style.color = "#4ade80";

                signupForm.reset();

                setTimeout(() => {
                    window.location.href = "index.html";
                }, 1200);

            } else {

                message.textContent =
                    "❌ " + data.message;

                message.style.color = "#f87171";

                button.textContent = "Create Account";
                button.disabled = false;
            }

        } catch (error) {

            console.error(error);

            message.textContent =
                "❌ Unable to connect to server.";

            message.style.color = "#f87171";

            button.textContent = "Create Account";
            button.disabled = false;
        }
    });
}


// =========================
// DASHBOARD
// =========================

const userEmail = document.getElementById("userEmail");

if (userEmail) {

    const email = sessionStorage.getItem("userEmail");

    if (!email) {

        window.location.href = "index.html";

    } else {

        userEmail.textContent = email;
    }
}


// =========================
// LOGOUT
// =========================

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", function () {

        sessionStorage.removeItem("userEmail");

        window.location.href = "index.html";
    });
}