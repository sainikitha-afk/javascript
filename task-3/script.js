const thumbnails = document.querySelectorAll(".thumb");
const modal = document.getElementById("modal");
const modalImg = document.getElementById("modalImg");
const closeBtn = document.querySelector(".close");

// Open modal
thumbnails.forEach(img => {
    img.addEventListener("click", () => {
        modal.classList.add("show");
        modalImg.src = img.src;
    });
});

// Close modal (X button)
closeBtn.addEventListener("click", () => {
    modal.classList.remove("show");
});

// Close when clicking outside image
modal.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.classList.remove("show");
    }
});