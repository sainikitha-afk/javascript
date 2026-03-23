const list = document.getElementById("list");
let draggedItem = null;

const items = document.querySelectorAll("li");

items.forEach(item => {

    item.addEventListener("dragstart", () => {
        draggedItem = item;
        item.classList.add("dragging");
    });

    item.addEventListener("dragend", () => {
        item.classList.remove("dragging");
    });

    item.addEventListener("dragover", (e) => {
        e.preventDefault();
        item.classList.add("over");
    });

    item.addEventListener("dragleave", () => {
        item.classList.remove("over");
    });

    item.addEventListener("drop", () => {
        item.classList.remove("over");

        if (draggedItem !== item) {
            const temp = item.textContent;
            item.textContent = draggedItem.textContent;
            draggedItem.textContent = temp;
        }
    });

});