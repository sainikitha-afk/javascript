const questions = [
    {
        question: "What is HTML?",
        options: ["Programming Language", "Markup Language", "Database", "Operating System"],
        answer: 1
    },
    {
        question: "What does CSS do?",
        options: ["Structure", "Styling", "Logic", "Storage"],
        answer: 1
    },
    {
        question: "Which is JS used for?",
        options: ["Styling", "Structure", "Interactivity", "None"],
        answer: 2
    }
];

let currentQuestion = 0;
let score = 0;
let selectedOption = null;

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const nextBtn = document.getElementById("nextBtn");
const resultEl = document.getElementById("result");

// Load question
function loadQuestion() {
    const q = questions[currentQuestion];
    questionEl.textContent = q.question;

    optionsEl.innerHTML = "";
    selectedOption = null;

    q.options.forEach((option, index) => {
        const btn = document.createElement("div");
        btn.textContent = option;
        btn.classList.add("option");

        btn.addEventListener("click", () => {
            document.querySelectorAll(".option").forEach(opt => opt.classList.remove("selected"));
            btn.classList.add("selected");
            selectedOption = index;
        });

        optionsEl.appendChild(btn);
    });
}

// Next button
nextBtn.addEventListener("click", () => {
    if (selectedOption === null) return;

    if (selectedOption === questions[currentQuestion].answer) {
        score++;
    }

    currentQuestion++;

    if (currentQuestion < questions.length) {
        loadQuestion();
    } else {
        showResult();
    }
});

// Show result
function showResult() {
    questionEl.textContent = "Quiz Completed!";
    optionsEl.innerHTML = "";
    nextBtn.style.display = "none";

    resultEl.textContent = `Your Score: ${score} / ${questions.length}`;
}

// Initial load
loadQuestion();