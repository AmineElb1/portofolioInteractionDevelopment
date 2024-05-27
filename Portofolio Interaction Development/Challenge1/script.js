document.addEventListener("DOMContentLoaded", () => {
    const questions = [
        {
            question: "Wat is de hoofdstad van Nederland?",
            answer: "Amsterdam"
        },
        {
            question: "Hoeveel is 2 + 2?",
            answer: "vier"
        },
        {
            question: "Welke kleur heeft een banaan?",
            answer: "Geel"
        }
    ];

    let currentQuestionIndex = 0;

    const questionContainer = document.getElementById("question-container");
    const resultContainer = document.getElementById("result-container");
    const userAnswerContainer = document.getElementById("user-answer-container");
    const answerButton = document.getElementById("answer-button");

    const synth = window.speechSynthesis;
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "nl-NL";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    function speak(text) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "nl-NL";
        synth.speak(utterance);
    }

    function askQuestion() {
        if (currentQuestionIndex < questions.length) {
            const question = questions[currentQuestionIndex].question;
            questionContainer.textContent = question;
            speak(question);
        } else {
            questionContainer.textContent = "Je hebt alle vragen beantwoord!";
            answerButton.style.display = "none";
        }
    }

    function checkAnswer(userAnswer) {
        const correctAnswer = questions[currentQuestionIndex].answer;
        userAnswerContainer.textContent = `Je zei: ${userAnswer}`;
        if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
            resultContainer.textContent = "Juist!";
            resultContainer.className = "result";
        } else {
            resultContainer.textContent = `Fout! Het juiste antwoord is ${correctAnswer}.`;
            resultContainer.className = "error";
        }
        currentQuestionIndex++;
        setTimeout(() => {
            resultContainer.textContent = "";
            userAnswerContainer.textContent = "";
            askQuestion();
        }, 3000);  // wacht 3 seconden voordat de volgende vraag wordt gesteld
    }

    recognition.onresult = (event) => {
        const userAnswer = event.results[0][0].transcript;
        checkAnswer(userAnswer);
    };

    recognition.onerror = (event) => {
        resultContainer.textContent = "Er is een fout opgetreden tijdens de spraakherkenning.";
        resultContainer.className = "error";
    };

    recognition.onend = () => {
        // Herstart de spraakherkenning niet automatisch na een vraag
    };

    answerButton.addEventListener("click", () => {
        if (currentQuestionIndex < questions.length) {
            resultContainer.textContent = "";
            recognition.start();
        }
    });

    askQuestion();
});
