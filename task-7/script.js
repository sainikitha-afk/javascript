const chatBox = document.getElementById("chatBox");
const input = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");

// Get time
function getTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Add message
function addMessage(text, type) {
    const msg = document.createElement("div");
    msg.classList.add("message", type);

    msg.innerHTML = `
        ${text}
        <div class="time">${getTime()}</div>
    `;

    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Simulated reply
function botReply() {
    const replies = [
        "Interesting 🤔",
        "Tell me more!",
        "That sounds cool 😄",
        "I agree 👍",
        "Nice!"
    ];

    const random = replies[Math.floor(Math.random() * replies.length)];

    setTimeout(() => {
        addMessage(random, "bot");
    }, 1000);
}

// Send message
function sendMessage() {
    const text = input.value.trim();
    if (text === "") return;

    addMessage(text, "user");
    input.value = "";

    botReply();
}

sendBtn.addEventListener("click", sendMessage);

input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
});