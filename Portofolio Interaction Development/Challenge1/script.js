var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
const spreekKnop = document.querySelector("#answer-button");
const vraagElement = document.querySelector("#question-container");
const quizContainer = document.querySelector("#quiz-container");

const vragen = [
  {
    vraag: "Wat is de hoofstad van België?",	
    antwoorden: ["brussel"],
  },
  {
    vraag: "Wat is de hoofdstad van Nederland?",
    antwoorden: ["amsterdam"],
  },
  {
    vraag: "Wat is de hoofdstad van Frankrijk?",
    antwoorden: ["parijs"],
  },
];

let huidigeVraagIndex = 0;
let laatsteTranscriptie = "";
const herkenning = new SpeechRecognition();
herkenning.lang = "nl-BE";
let timeoutId;

herkenning.onresult = function (event) {
  clearTimeout(timeoutId);
  laatsteTranscriptie = event.results[0][0].transcript.toLowerCase();
  if (vragen[huidigeVraagIndex].antwoorden.includes(laatsteTranscriptie)) {
    quizContainer.style.backgroundColor = "#8BC34A";
    setTimeout(() => {
      quizContainer.style.backgroundColor = "#fff";
      huidigeVraagIndex++;
      if (huidigeVraagIndex < vragen.length) {
        stelVraag();
      } else {
        quizContainer.style.backgroundColor = "#8BC34A";
        vraagElement.textContent = "Quiz is over";
        spreekKnop.disabled = true;
        spreekKnop.style.display = "none";
      }
    }, 700);
  } else {
    quizContainer.style.backgroundColor = "#FF5722";
    setTimeout(() => {
      quizContainer.style.backgroundColor = "#fff";
      spreekKnop.disabled = false;
    }, 700);
  }
};

herkenning.onspeechend = function () {
  herkenning.stop();
};

herkenning.onend = function () {
  if (
    huidigeVraagIndex < vragen.length &&
    !vragen[huidigeVraagIndex].antwoorden.includes(laatsteTranscriptie)
  ) {
    quizContainer.style.backgroundColor = "#FF5722";
    setTimeout(() => {
      quizContainer.style.backgroundColor = "#fff";
      spreekKnop.disabled = false;
    }, 700);
  }
};

spreekKnop.addEventListener("click", function () {
  spreekKnop.disabled = true;
  stelVraag();
});


function stelVraag() {
  vraagElement.textContent = vragen[huidigeVraagIndex].vraag;
  leesVraagVoor(vragen[huidigeVraagIndex].vraag).then(() => {
    herkenning.start();
    timeoutId = setTimeout(() => {
      herkenning.stop();
    }, 5000);
  });
}

function leesVraagVoor(vraag) {
  return new Promise((resolve) => {
    const synth = window.speechSynthesis;
    const uiting = new SpeechSynthesisUtterance(vraag);
    uiting.lang = "nl-BE";
    uiting.onend = resolve;
    synth.speak(uiting);
  });
}
