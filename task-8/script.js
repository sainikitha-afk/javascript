const app = document.getElementById("app");

// Routes
const routes = {
    home: `
        <div class="page">
            <h1>Home</h1>
            <p>Welcome to the SPA demo.</p>
        </div>
    `,
    about: `
        <div class="page">
            <h1>About</h1>
            <p>This app uses hash-based routing.</p>
        </div>
    `,
    services: `
        <div class="page">
            <h1>Services</h1>
            <p>We provide frontend development solutions.</p>
        </div>
    `,
    contact: `
        <div class="page">
            <h1>Contact</h1>
            <p>Email: example@email.com</p>
        </div>
    `
};

// Render function
function render() {
    const hash = window.location.hash.replace("#", "") || "home";
    app.innerHTML = routes[hash] || "<h1>Page Not Found</h1>";
}

// Listen to route changes
window.addEventListener("hashchange", render);

// Initial load
render();