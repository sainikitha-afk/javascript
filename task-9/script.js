const container = document.getElementById("container");
const loader = document.getElementById("loader");

let page = 1;
let loading = false;

// Generate dummy posts
function getPosts() {
    return new Promise(resolve => {
        setTimeout(() => {
            const posts = [];

            for (let i = 1; i <= 10; i++) { // MORE posts
                posts.push(`Post ${i + (page - 1) * 10}`);
            }

            resolve(posts);
        }, 500);
    });
}

// Load posts
async function loadPosts() {
    if (loading) return;
    loading = true;

    loader.style.display = "block";

    const posts = await getPosts();

    posts.forEach(text => {
        const div = document.createElement("div");
        div.classList.add("post");
        div.textContent = text;

        container.appendChild(div);
    });

    loader.style.display = "none";
    loading = false;
    page++;

    // 🔥 IMPORTANT: If still not scrollable, load more automatically
    if (document.body.scrollHeight <= window.innerHeight) {
        loadPosts();
    }
}

// Scroll detection
window.addEventListener("scroll", () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        loadPosts();
    }
});

// Initial load
loadPosts();