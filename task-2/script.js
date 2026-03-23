const display = document.getElementById("display");

// Append numbers/operators
function append(value) {
    display.value += value;
}

// Clear screen
function clearDisplay() {
    display.value = "";
}

// Calculate result
function calculate() {
    try {
        display.value = eval(display.value);
    } catch {
        display.value = "Error";
    }
}