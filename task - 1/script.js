const input = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

function addTask() {
    const taskText = input.value.trim();
    if (taskText === "") return;

    const li = document.createElement("li");

    // Task text
    const span = document.createElement("span");
    span.textContent = taskText;
    span.classList.add("task-text");

    // Buttons container
    const actions = document.createElement("div");
    actions.classList.add("actions");

    // COMPLETE BUTTON
    const completeBtn = document.createElement("button");
    completeBtn.textContent = "✔";
    completeBtn.classList.add("complete-btn");

    completeBtn.addEventListener("click", () => {
        span.classList.toggle("completed");
    });

    // EDIT BUTTON
    const editBtn = document.createElement("button");
    editBtn.textContent = "✏";
    editBtn.classList.add("edit-btn");

    editBtn.addEventListener("click", () => {
        if (editBtn.textContent === "✏") {
            const newInput = document.createElement("input");
            newInput.type = "text";
            newInput.value = span.textContent;
            newInput.classList.add("edit-input");

            li.replaceChild(newInput, span);
            editBtn.textContent = "💾";

            newInput.focus();
        } else {
            const newText = li.querySelector("input").value;
            span.textContent = newText;

            li.replaceChild(span, li.querySelector("input"));
            editBtn.textContent = "✏";
        }
    });

    // DELETE BUTTON
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "✖";
    deleteBtn.classList.add("delete-btn");

    deleteBtn.addEventListener("click", () => {
        li.remove();
    });

    // Append
    actions.appendChild(completeBtn);
    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    li.appendChild(span);
    li.appendChild(actions);

    taskList.appendChild(li);

    input.value = "";
}

addBtn.addEventListener("click", addTask);

input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addTask();
});