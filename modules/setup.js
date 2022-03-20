import { play, startTime } from "../play.js";
import { diffs, allRoundsObj, registerRound } from "./objects.js";
import { ColorGen, Element, Round } from "./classes.js";

//// Global variables
const root = document.querySelector(":root");
const mode = document.getElementsByName("mode");
const diff = document.getElementsByName("difficulty");
const extreme = document.getElementById("xtrm");
const eCL = extreme.classList;
const newGame = document.getElementById("new");
const nGBCL = newGame.classList;
const points = document.getElementById("points");
const rounds = document.getElementById("rounds");
const rContainer = document.getElementById("round-s");
const rSummary = document.getElementById("r-summary");
const rCCL = rContainer.classList;
const board = document.getElementById("color-options");
const lang = document.getElementsByName("lang");

let cLang;
let pointsWon = 0;
let pointsLost = 0;

for (let l of lang) {
  l.addEventListener("click", setLang);
}

//// User Interface
function setLang() {
  const rSummary = document.querySelectorAll("h3")[0];
  const info = document.querySelectorAll("h2")[0];
  const instructions = document.getElementById("instructions");
  const next = document.getElementById("next");
  const reset = document.getElementById("reset");
  const legends = document.querySelectorAll("legend");
  const mode = legends[0];
  const diff = legends[1];
  const labels = document.querySelectorAll("label");
  const random = labels[2];
  const mono = labels[3];
  const easy = labels[4];
  const medium = labels[5];
  const hard = labels[6];
  const xtrm = labels[7];
  const start = document.getElementById("start");
  const newG = document.getElementById("new");

  console.log();

  for (let l of lang) {
    if (l.checked) cLang = l.value;
  }

  if (cLang === "en") {
    rSummary.innerText = "Round Summary:";
    info.innerText = "Instructions";
    instructions.innerHTML =
      "<p><span>Choose the color mode:</span> <ul><li>random (aleatory colors) or</li><li>monochromatic(similar colors);</li></ul></p><p><span>Choose the difficulty:</span> <ul><li>easy (6 tiles),</li><li>medium (8 tiles),</li> <li>hard (12 tiles)...</li></ul></p> <p>And finally <span>start a game</span> and find, among the tiles on the board, the color that matches the main one! Things migth get a bit... <span>extreme</span>, if you get enough points</p></p>";
    next.innerText = "Next Round";
    reset.innerText = "Reset Game";
    mode.innerText = "Color Mode";
    diff.innerText = "Choose Difficulty";
    random.innerText = "Random";
    mono.innerText = "Monochromatic";
    easy.innerText = "Easy";
    medium.innerText = "Medium";
    hard.innerText = "Hard";
    xtrm.innerText = "Extreme";
    start.innerText = "Start Game";
    newG.innerText = "New Game";
  } else {
    rSummary.innerText = "Resumo do Round:";
    info.innerText = "Instruções";
    instructions.innerHTML =
      "<p><span>Escolha o modo:</span> <ul><li>random (cores aleatórias) ou</li><li>monocromático(cores parecidas);</li></ul></p><p><span>Escolha a dificuldade:</span><ul><li>fácil (6 cores),</li><li>médio (8 cores),</li><li>difícil (12 cores)...</li></ul></p><p>E finalmente <span>inicie um jogo</span> e encontre entre as cores na tela a cor igual a cor principal! As coisas podem ficar... <span>extremas</span>, se você conseguir pontos suficientes.</p></p>";
    next.innerText = "Próximo Round";
    reset.innerText = "Zerar Partida";
    mode.innerText = "Escolha o Modo";
    diff.innerText = "Escolha a Dificuldade";
    random.innerText = "Random";
    mono.innerText = "Monocromático";
    easy.innerText = "Fácil";
    medium.innerText = "Médio";
    hard.innerText = "Difícil";
    xtrm.innerText = "Extremo";
    start.innerText = "Começar Partida";
    newG.innerText = "Nova Partida";
  }
}

//// Instructions
function showInfo() {
  let instructions = document.getElementById("instructions");
  instructions.classList.toggle("clear");
}

//// Context = mode + difficulty
function gameContext() {
  const gContext = [];
  for (let m of mode.values()) {
    if (m.checked) gContext.push(m.value);
  }
  for (let d of diff.values()) {
    if (d.checked) gContext.push(d.value);
  }
  return gContext;
}

//// Visibility control
/// Round summary
function showSummary() {
  rContainer.classList.toggle("clear");
}

/// New game button
function newGameButton() {
  newGame.classList.toggle("clear");
}

/// Score
function scoreBoard() {
  points.classList.toggle("clear");
  rounds.classList.toggle("clear");
}

/// Secret difficulty
function showExtreme() {
  const cp = points.innerHTML; //current points
  const eIvsbl = eCL.contains("clear");
  if (+cp.slice(0, 3) >= 100 && eIvsbl) extreme.classList.toggle("clear");
}

//// Updates
/// Points
function updatePoints(bool) {
  showExtreme();
  const cp = points.innerHTML;
  let currentDiff;
  let currentPoints = +cp.slice(0, 3);

  for (let d of diff.values()) {
    if (d.checked) currentDiff = d.value;
  }

  switch (currentDiff) {
    case "easy":
      if (bool)
        (currentPoints += diffs.easy.points), (pointsWon += diffs.easy.points);
      if (!bool && currentPoints >= 2) currentPoints -= diffs.easy.points;
      if (!bool) pointsLost += diffs.easy.points;
      break;
    case "medium":
      if (bool)
        (currentPoints += diffs.medium.points),
          (pointsWon += diffs.medium.points);
      if (!bool && currentPoints >= 3) currentPoints -= diffs.medium.points;
      if (!bool) pointsLost += diffs.medium.points;
      break;
    case "hard":
      if (bool)
        (currentPoints += diffs.hard.points), (pointsWon += diffs.hard.points);
      if (!bool && currentPoints >= 4) currentPoints -= diffs.hard.points;
      if (!bool) pointsLost += diffs.hard.points;
      break;
    case "extreme":
      if (bool)
        (currentPoints += diffs.extreme.points),
          (pointsWon += diffs.extreme.points);
      if (!bool && currentPoints >= 1) currentPoints -= diffs.extreme.points;
      if (!bool) pointsLost += diffs.extreme.points;
      break;
  }

  if (currentPoints === 0) {
    if (cLang === "en") points.innerHTML = `000 <strong>Points</strong>`;
    else points.innerHTML = `000 <strong>Pont0s</strong>`;
  } else if (currentPoints < 10) {
    if (cLang === "en")
      points.innerHTML = `00${currentPoints} <strong>Points</strong>`;
    else points.innerHTML = `00${currentPoints} <strong>Pontos</strong>`;
  } else if (currentPoints < 100) {
    if (cLang === "en")
      points.innerHTML = `0${currentPoints} <strong>Points</strong>`;
    else points.innerHTML = `0${currentPoints} <strong>Pontos</strong>`;
  } else {
    if (cLang === "en")
      points.innerHTML = `${currentPoints} <strong>Points</strong>`;
    else points.innerHTML = `${currentPoints} <strong>Pontos</strong>`;
  }
}

/// Rounds
// Track time
function timer() {
  const startTime = new Date();
  return startTime;
}

//Create round summary
function roundSummary() {
  // clear previous summary
  rSummary.innerHTML = "";

  // calculate time
  const eTime = new Date() - startTime;
  console.log(eTime);

  const currentRound = rounds.innerHTML;
  let cr = +currentRound.slice(-2);
  const cp = points.innerHTML;
  let tPoints = +cp.slice(0, 3);
  const thisRound = new Round(cr, tPoints, pointsWon, pointsLost, eTime);
  let summary;
  if (cLang === "en") summary = thisRound.summary;
  else summary = thisRound.resumo;

  console.log(thisRound);

  for (let i = 0; i < summary.length; i++) {
    const para = document.createElement("p");
    para.appendChild(document.createTextNode(summary[i]));
    rSummary.appendChild(para);
  }

  if (roundEnd()) {
    const sRInvisible = rCCL.contains("clear");
    if (sRInvisible) showSummary();
    registerRound(cr, thisRound);

    pointsWon = 0;
    pointsLost = 0;
  }
}

// Check if round ended
function roundEnd() {
  const children = board.childNodes;
  const childrenIDs = [];

  for (let i = 0; i < children.length - 2; i++) {
    childrenIDs.push(children[i].id);
  }

  const matched = (id) => id === "matched";
  const allMatched = childrenIDs.filter(matched).length;
  return children.length - 2 === allMatched;
}

/// Color lists
function updateColors(bool, str, id) {
  const hsl = document.getElementById("hsl-colors");
  const rgb = document.getElementById("rgb-colors");
  const element = document.getElementById(id);
  const hslColors = hsl.innerHTML;
  const rgbColors = rgb.innerHTML;
  const hslArr = hslColors.split("-");
  const rgbArr = rgbColors.split("-");

  if (bool && rgbArr.length !== 1) {
    hslArr.splice(rgbArr.indexOf(str), 1);
    rgbArr.splice(rgbArr.indexOf(str), 1);
    element.id = "matched";
    element.removeAttribute("style");
    updateMainColor(hslArr, rgbArr);
    rgb.innerHTML = rgbArr.join("-");
    hsl.innerHTML = hslArr.join("-");
  } else if (rgbArr.length === 1) {
    hslArr.splice(rgbArr.indexOf(str), 1);
    rgbArr.splice(rgbArr.indexOf(str), 1);
    element.id = "matched";
    element.removeAttribute("style");
    updateMainColor(["hsl(0,0%,100%)"], ["rgb(255,255,255)"]);
    rgb.innerHTML = rgbArr.join("-");
    hsl.innerHTML = hslArr.join("-");
  }
}

//// Board setup
/// Empties board, hides secret difficulty, reset points + rounds
function prepareBoard() {
  const bIsEmpty = board.innerHTML === "";
  const eIvsbl = eCL.contains("clear");
  const nGBInvisible = nGBCL.contains("clear");
  const sRInvisible = rCCL.contains("clear");
  if (!bIsEmpty) {
    board.innerHTML = "";
    updateMainColor(["hsl(0,0%,100%)"], ["rgb(255,255,255)"]);
    if (!nGBInvisible) {
      newGameButton();
      scoreBoard();
    }
    if (!eIvsbl) showExtreme();
    if (!sRInvisible) showSummary();
  } else {
    points.innerHTML = "000 <strong>Points</strong>";
    rounds.innerHTML = "<strong>Round</strong> 01";
  }
}

/// Main Color
function updateMainColor(hsl, rgb) {
  const nextColor = rgb[Math.floor(Math.random() * rgb.length)];
  const nextBG = hsl[rgb.indexOf(nextColor)].split(",");
  nextBG[2] === "100%)" ? {} : nextBG.splice(2, 1, "90%)");
  const bodyBG = nextBG.join(",");
  root.style.setProperty("--bgColor", `${bodyBG}`);
  root.style.setProperty("--mainColor", `${nextColor}`);
  const nextUi = bodyBG.split(",");
  nextUi.splice(2, 1, "25%)");
  root.style.setProperty("--uiColor", `${nextUi}`);
}

/// Board filler
function displayElements(arr1, arr2, str) {
  // Adjust size
  switch (str) {
    case "easy":
      root.style.setProperty("--size", "150px");
      break;
    case "medium":
      root.style.setProperty("--size", "130px");
      break;
    case "hard":
      root.style.setProperty("--size", "105px");
      break;
    case "extreme":
      root.style.setProperty("--size", "70px");
      break;
  }

  // Sends elements to board
  for (let i = 0; i < diffs[str].elements; i++) {
    const nE = new Element(`element-${i}`, arr1[i], arr2[i], str);
    const para = document.createElement("p");
    const hiddenCode = document.createElement("span");

    hiddenCode.classList.add("clear");
    hiddenCode.appendChild(document.createTextNode(arr1[i]));
    para.setAttribute("id", nE.id);
    para.setAttribute("class", "element");
    para.style.setProperty("color", arr2[i]);
    para.appendChild(document.createTextNode(nE.icon));
    para.appendChild(hiddenCode);
    para.addEventListener("click", play);
    para.addEventListener("click", roundSummary);
    board.appendChild(para);
  }
}

/// Combine everything
function showGame() {
  const hslColors = document.createElement("p");
  const rgbColors = document.createElement("p");
  const context = gameContext();
  const m = context[0];
  const d = context[1];
  const newColors = new ColorGen(m, diffs[d]);
  const ColorLists = newColors.colors;
  const hsl = ColorLists[0];
  const rgb = ColorLists[1];
  prepareBoard();
  updateMainColor(hsl, rgb);
  displayElements(hsl, rgb, d);
  newGameButton();
  scoreBoard();
  hslColors.appendChild(document.createTextNode(`${hsl.join("-")}`));
  rgbColors.appendChild(document.createTextNode(`${rgb.join("-")}`));
  hslColors.setAttribute("id", "hsl-colors");
  rgbColors.setAttribute("id", "rgb-colors");
  hslColors.classList.add("clear");
  rgbColors.classList.add("clear");
  board.appendChild(hslColors);
  board.appendChild(rgbColors);
}

export {
  showInfo,
  updatePoints,
  timer,
  roundEnd,
  updateColors,
  prepareBoard,
  showGame,
};
