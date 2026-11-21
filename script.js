const SUPABASE_URL = "https://kgtkugdyozgmhnugqxzm.supabase.co";

const SUPABASE_KEY = "sb_publishable_lL8YZf9ugH7_4LArFzVh4w_v83YLeBY";


const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );



/* =========================
   LOGIN
========================= */

const loginForm =
    document.getElementById("loginForm");


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();

            const email =
                document.getElementById("email").value;

            const password =
                document.getElementById("password").value;

            const message =
                document.getElementById("message");

            const button =
                document.getElementById("loginBtn");


            button.textContent = "Logging in...";

            button.disabled = true;


            const { data, error } =
                await supabaseClient.auth.signInWithPassword({

                    email: email,

                    password: password

                });


            if (error) {

                message.textContent =
                    "❌ " + error.message;

                message.style.color = "#f87171";

                button.textContent = "Login";

                button.disabled = false;

            }

            else {

                message.textContent =
                    "✅ Login successful!";

                message.style.color = "#4ade80";


                setTimeout(() => {

                    window.location.href =
                        "dashboard.html";

                }, 700);

            }

        }
    );

}



/* =========================
   SHOW / HIDE PASSWORD
========================= */

const togglePassword =
    document.getElementById("togglePassword");


if (togglePassword) {

    togglePassword.addEventListener(
        "click",
        function() {

            const password =
                document.getElementById("password");


            if (password.type === "password") {

                password.type = "text";

                togglePassword.textContent = "🙈";

            }

            else {

                password.type = "password";

                togglePassword.textContent = "👁";

            }

        }
    );

}



/* =========================
   SIGN UP
========================= */

const signupForm =
    document.getElementById("signupForm");


if (signupForm) {

    signupForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const email =
                document.getElementById("signupEmail").value;


            const password =
                document.getElementById("signupPassword").value;


            const message =
                document.getElementById("signupMessage");


            const { data, error } =
                await supabaseClient.auth.signUp({

                    email: email,

                    password: password

                });


            if (error) {

                message.textContent =
                    "❌ " + error.message;

                message.style.color = "#f87171";

            }

            else {

                message.textContent =
                    "✅ Account created successfully!";

                message.style.color = "#4ade80";

                signupForm.reset();

            }

        }
    );

}



/* =========================
   DASHBOARD
========================= */

const userEmail =
    document.getElementById("userEmail");


if (userEmail) {

    loadUser();

}


async function loadUser() {

    const { data, error } =
        await supabaseClient.auth.getUser();


    if (error || !data.user) {

        window.location.href =
            "index.html";

        return;

    }


    userEmail.textContent =
        data.user.email;

}



/* =========================
   LOGOUT
========================= */

const logoutBtn =
    document.getElementById("logoutBtn");


if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        async function() {

            await supabaseClient.auth.signOut();

            window.location.href =
                "index.html";

        }
    );

}