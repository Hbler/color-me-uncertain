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

let pointsWon = 0;
let pointsLost = 0;

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

  if (currentPoints === 0) points.innerHTML = `000 <strong>Points</strong>`;
  else if (currentPoints < 10)
    points.innerHTML = `00${currentPoints} <strong>Points</strong>`;
  else if (currentPoints < 100)
    points.innerHTML = `0${currentPoints} <strong>Points</strong>`;
  else points.innerHTML = `${currentPoints} <strong>Points</strong>`;
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
  const summary = thisRound.summary;

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
