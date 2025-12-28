// const APIEndpoint = "http://api.quotable.io/random";
let time = document.querySelector("#time");
let timeBg = document.querySelector(".time");
let scoreDisplay = document.querySelector("#score");
let userInput = document.querySelector("textarea");
let quote = document.querySelector("#quote");

const game = {};
let hasFocus = false;
let timerID;

//

async function getQuote() {
  try {
    const response = await fetch("http://api.quotable.io/random");

    if (!response.ok) {
      throw new Error(`Error ${response.status}, ${response.statusText}`);
    }

    const responseData = await response.json();

    displayQuote(responseData.content);
  } catch (error) {
    console.log(error);
  }
}

function displayQuote(str) {
  str.split("").forEach((char) => {
    const span = document.createElement("span");
    span.textContent = char;
    quote.appendChild(span);
  });
}

function start() {
  game.isActive = false;
  game.score = 0;
  game.memoryScore = 0;
  game.timer = 60;
  game.endOfGame = false;
  restart();
}
start();

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (!game.endOfGame) {
      game.isActive = !game.isActive;
    } else {
      start();
    }
    gameManager();
  }
});

function gameManager() {
  if (game.endOfGame) {
    userInput.disabled = true;
    userInput.classList.remove("active");
    return;
  }
  if (game.isActive) {
    userInput.disabled = false;
    userInput.classList.add("active");
    scoreDisplay.textContent = 0;
    gameLoop();
  } else {
    userInput.disabled = true;
    userInput.classList.remove("active");
    clearTimeout(timerID);
    start();
  }
}

userInput.addEventListener("focus", () => {
  hasFocus = true;
  timeBg.classList.add("active");
});
userInput.addEventListener("blur", () => {
  hasFocus = false;
  timeBg.classList.remove("active");
});
function gameLoop() {
  time.textContent = game.timer;
  if (game.timer <= 0) {
    clearTimeout(timerID);
    game.endOfGame = true;
    gameManager();
    return;
  }
  timerID = setTimeout(() => {
    if (hasFocus) {
      game.timer--;
    }
    gameLoop();
  }, 1000);
}

userInput.addEventListener("input", checkInput);
function checkInput(e) {
  if (
    e.target.value.length > 0 &&
    e.target.value.length < quote.textContent.length
  ) {
    if (
      quote.textContent[e.target.value.length - 1] ===
      e.target.value[e.target.value.length - 1]
    ) {
      quote.children[e.target.value.length - 1].classList.add("bg_green");
    } else {
      quote.children[e.target.value.length - 1].classList.add("bg_red");
    }
  } else if (
    e.target.value.length === quote.textContent.length &&
    e.target.value === quote.textContent
  ) {
    restart();
  }

  // Reset affichage bg_span si on efface la saisie
  for (i = e.target.value.length; i < quote.textContent.length; i++) {
    quote.children[i].classList.remove("bg_green");
    quote.children[i].classList.remove("bg_red");
  }

  checkScore();
}

function checkScore() {
  // récupère le nombre de lettres qui ont la class "bg_green"
  game.score = [...quote.childNodes].filter((span) =>
    span.classList.contains("bg_green")
  ).length;

  scoreDisplay.textContent = game.memoryScore + game.score;
}

function restart() {
  game.memoryScore = game.memoryScore + game.score;
  quote.textContent = "";
  userInput.value = "";
  getQuote();
}
