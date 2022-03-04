import {
  showInfo,
  updatePoints,
  timer,
  roundEnd,
  updateColors,
  prepareBoard,
  showGame,
} from "./modules/setup.js";

//// Global Variables
const rounds = document.getElementById("rounds");
let startTime;

//// Listeners
document.getElementById("start").addEventListener("click", play);
document.getElementById("next").addEventListener("click", play);
document.getElementById("new").addEventListener("click", prepareBoard);
document.getElementById("reset").addEventListener("click", prepareBoard);
document.getElementById("info").addEventListener("click", showInfo);

//// Gameplay
/// Check for Match
function checkMatched(id) {
  const clicked = document.getElementById(id);
  const main = document.getElementById("main");
  const clickedColor = getComputedStyle(clicked).getPropertyValue("color");
  const mainColor = getComputedStyle(main).getPropertyValue("color");

  return [mainColor === clickedColor, mainColor];
}

/// Play Game!
function play() {
  const clicked = this.id;
  const nextRound = roundEnd();
  const currentRound = rounds.innerHTML;
  let cr = +currentRound.slice(-2);

  if (clicked === "start" || clicked === "next") {
    showGame();
    startTime = timer();
  } else if (clicked.startsWith("element-")) {
    const match = checkMatched(clicked);
    const bool = match[0];
    const color = match[1];
    updatePoints(bool);
    updateColors(bool, color, clicked);
  }

  if (nextRound) {
    cr++;
    if (cr < 10) rounds.innerHTML = `<strong>Round</strong> 0${cr}`;
    else rounds.innerHTML = `<strong>Round</strong> ${cr}`;
  }
}

export { play, startTime };
