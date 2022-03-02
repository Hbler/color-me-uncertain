import {
  rootVarNames,
  difficulties,
  mode,
  difficulty,
  randInt,
  rgbToHSL,
} from "./support-elements.js";

import { play } from "../gameplay.js";

function setGameParams() {
  const gameParams = [];
  for (let m of mode.values()) {
    if (m.checked) {
      gameParams.push(m.value);
    }
  }
  for (let dif of difficulty.values()) {
    if (dif.checked) {
      gameParams.push(dif.value);
    }
  }
  return gameParams;
}

//// Manage colors
/// Generate colors
function genColors(mode, dif) {
  const amount = difficulties[`${dif}`].length;
  const colors = [];
  const hue = ["red", "yellow", "green", "cyan", "blue", "magenta"];
  let H, S, L, newColor;

  // Generating needed amout of colors
  if (mode === "random") {
    while (colors.length < amount) {
      H = randInt(0, 360);
      S = randInt(20, 100);
      L = randInt(40, 60);
      newColor = `hsl(${H},${S}%,${L}%)`;
      colors.push(newColor);
    }
  } else if (mode === "mono") {
    const mono = hue[Math.floor(Math.random() * 6)];
    while (colors.length < amount) {
      switch (mono) {
        case "red":
          H = randInt(10, 50);
          break;
        case "yellow":
          H = randInt(70, 110);
          break;
        case "green":
          H = randInt(130, 170);
          break;
        case "cyan":
          H = randInt(190, 230);
          break;
        case "blue":
          H = randInt(250, 290);
          break;
        case "magenta":
          H = randInt(310, 350);
          break;
      }
      S = randInt(20, 100);
      L = randInt(40, 60);
      newColor = `hsl(${H},${S}%,${L}%)`;
      colors.push(newColor);
    }
  }
  return colors;
}
/// Update Variables
// Main Color
function updateMainColor(arr) {
  const nextC = arr[Math.floor(Math.random() * arr.length)];
  const root = document.querySelector(":root");
  const bgC = nextC.split(",");
  bgC.splice(2, 1, "95%)");
  root.style.setProperty("--bgColor", `${bgC}`);
  root.style.setProperty("--mainColor", `${nextC}`);
}
// Hexagons
function updateRootVar(arr) {
  const root = document.querySelector(":root");
  // const rStyle = getComputedStyle(root); // Gets all styles
  const varNames = rootVarNames.slice(0, arr.length);
  for (let i = 0; i < varNames.length; i++) {
    const v = varNames[i];
    root.style.setProperty(`--${v}`, `${arr[i]}`);
  }
}

//// Game setup

// Button visibility
function newGameButton() {
  const newGame = document.getElementById("new");
  newGame.classList.toggle("clear");
}

// Score visibility
function scoreBoard() {
  const points = document.getElementById("points");
  const rounds = document.getElementById("rounds");
  points.classList.toggle("clear");
  rounds.classList.toggle("clear");
}

//Check if board is empty
function setupDisplay() {
  const board = document.getElementById("color-options");
  const points = document.getElementById("points");
  const rounds = document.getElementById("rounds");
  const bClassList = document.getElementById("new").classList;
  const bInvisible = bClassList.contains("clear");
  const isEmpty = board.innerHTML === "";

  if (!isEmpty) {
    board.innerHTML = "";
    updateMainColor(["#fff"]);
    if (!bInvisible) {
      newGameButton();
      scoreBoard();
    }
  } else {
    points.innerHTML = "000 <strong>Points</strong>";
    rounds.innerHTML = "<strong>Round</strong> 01";
  }
}

// Board filler
function displayColorOptions(dif, arr) {
  const board = document.getElementById("color-options");
  const classNames = difficulties[`${dif}`];
  const limit = classNames.length;
  const root = document.querySelector(":root");

  // Adjuts size
  if (limit === 6) {
    root.style.setProperty("--width", "120px");
  } else if (limit === 8) {
    root.style.setProperty("--width", "90px");
  } else if (limit === 12) {
    root.style.setProperty("--width", "70px");
  }

  // Send elements to board
  if (limit <= 12) {
    for (let i = 0; i < limit; i++) {
      const hClass = classNames[i];
      const outerDiv = document.createElement("div");
      const hexagon = document.createElement("div");
      outerDiv.setAttribute("class", "outer");
      hexagon.setAttribute("id", `element-${i}`);
      hexagon.setAttribute("class", "hexagon");
      hexagon.classList.add(`${hClass}`);
      hexagon.addEventListener("click", play);
      outerDiv.appendChild(hexagon);
      board.appendChild(outerDiv);
    }
  } else {
    for (let i = 0; i < limit; i++) {
      const element = document.createElement("p");
      element.setAttribute("id", `element-${i}`);
      element.setAttribute("class", "extreme");
      element.appendChild(document.createTextNode("⧫"));
      element.style.setProperty("color", `${arr[i]}`);
      element.addEventListener("click", play);
      board.appendChild(element);
    }
  }
}

// Display everything
function showGame() {
  const board = document.getElementById("color-options");
  const paragraph = document.createElement("p");
  const params = setGameParams();
  const mode = params[0];
  const dif = params[1];
  const colors = genColors(mode, dif);
  const roundColors = document.createTextNode(`${colors.join("-")}`);
  setupDisplay();
  updateMainColor(colors);
  updateRootVar(colors);
  displayColorOptions(dif, colors);
  newGameButton();
  scoreBoard();
  paragraph.appendChild(roundColors);
  paragraph.setAttribute("id", "round-colors");
  paragraph.classList.add("clear");
  board.appendChild(paragraph);
}

export {
  rootVarNames,
  difficulties,
  mode,
  difficulty,
  randInt,
  rgbToHSL,
  setGameParams,
  genColors,
  updateMainColor,
  updateRootVar,
  newGameButton,
  scoreBoard,
  setupDisplay,
  displayColorOptions,
  showGame,
};
