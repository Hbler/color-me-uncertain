//// Variables
// Array and Objects
const rootVarNames = [
  "colorOne",
  "colorTwo",
  "colorThr",
  "colorFou",
  "colorFiv",
  "colorSix",
  "colorSev",
  "colorEig",
  "colorNin",
  "colorTen",
  "colorEle",
  "colorTwe",
];

const difficulties = {
  easy: ["h-one", "h-two", "h-thr", "h-fou", "h-fiv", "h-six"],
  medium: [
    "h-one",
    "h-two",
    "h-thr",
    "h-fou",
    "h-fiv",
    "h-six",
    "h-sev",
    "h-eig",
  ],
  hard: [
    "h-one",
    "h-two",
    "h-thr",
    "h-fou",
    "h-fiv",
    "h-six",
    "h-sev",
    "h-eig",
    "h-nin",
    "h-ten",
    "h-ele",
    "h-twe",
  ],
  extreme: Array.apply(null, Array(36)).map(function (x, i) {
    return i;
  }),
};

let modes = document.getElementsByName("mode");
let difficulty = document.getElementsByName("difficulty");

// Listeners
for (let mode of modes.values()) {
  document.getElementById(mode.id).addEventListener("click", setGameParams); // Event handler onclick
}

for (let dif of difficulty.values()) {
  document.getElementById(dif.id).addEventListener("click", setGameParams); // Event handler onclick
}

document.getElementById("start").addEventListener("click", play);
document.getElementById("new").addEventListener("click", setupDisplay);

function setGameParams() {
  const gameParams = [];
  for (let mode of modes.values()) {
    if (mode.checked) {
      gameParams.push(mode.value);
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
// Randon integer from interval
function randInt(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// RGB to HSL converters
function rgbToHSL(str) {
  let sep = str.indexOf(",") > -1 ? "," : " ";
  rgb = str.substr(4).split(")")[0].split(sep);

  for (let R in rgb) {
    let r = rgb[R];
    if (r.indexOf("%") > -1)
      rgb[R] = Math.round((r.substr(0, r.length - 1) / 100) * 255);
  }

  // make rgb fractions of one
  let r = rgb[0] / 255,
    g = rgb[1] / 255,
    b = rgb[2] / 255;

  // find gratest and smallest channel values
  let cmin = Math.min(r, g, b),
    cmax = Math.max(r, g, b),
    delta = cmax - cmin,
    h = 0,
    s = 0,
    l = 0;

  // calculate hue
  // no difference
  if (delta == 0) h = 0;
  // red is max
  else if (cmax == r) h = ((g - b) / delta) % 6;
  // green is max
  else if (cmax == g) h = (b - r) / delta + 2;
  // blue is max
  else h = (r - g) / delta + 4;

  h = Math.round(h * 60);

  // make negative hues positive behinde 360º
  if (h < 0) h += 360;

  // Calculate lightness
  l = (cmax + cmin) / 2;

  // Calculate saturation
  s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  // Multiply l and s by 100
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return (
    "hsl(" + Math.round(h) + "," + Math.round(s) + "%," + Math.round(l) + "%)"
  );
}

// Generate
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

// Update Variables
// Main Color
function updateMainColor(arr) {
  const nextC = arr[Math.floor(Math.random() * arr.length)];
  const root = document.querySelector(":root");
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

//Check if board is empty
function setupDisplay() {
  const board = document.getElementById("color-options");
  const bClassList = document.getElementById("new").classList;
  const bInvisible = bClassList.contains("clear");
  const isEmpty = board.innerHTML === "";

  if (!isEmpty) {
    board.innerHTML = "";
    updateMainColor(["#fff"]);
    if (!bInvisible) {
      newGameButton();
    }
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
    root.style.setProperty("--width", "80px");
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
  paragraph.appendChild(roundColors);
  paragraph.setAttribute("id", "round-colors");
  paragraph.classList.add("clear");
  board.appendChild(paragraph);
}

//// Gameplay
// Update main color + remove matched
function updateGame(arr) {
  const colorPara = document.getElementById("round-colors");
  const colors = colorPara.innerHTML;
  const colorArr = colors.split("-");
  const match = arr;
  const matched = match[0];
  const color = rgbToHSL(match[1]);
  const element = document.getElementById(match[2]);

  if (matched && colorArr.length !== 1) {
    // console.log(colorArr.indexOf(`${color}`));
    colorArr.splice(colorArr.indexOf(`${color}`), 1);
    element.id = "matched";
    updateMainColor(colorArr);
    colorPara.innerHTML = colorArr.join("-");
  } else if (colorArr.length === 1) {
    colorArr.splice(colorArr.indexOf(`${color}`), 1);
    element.id = "matched";
    updateMainColor(["#fff"]);
    colorPara.innerHTML = colorArr.join("-");
  }
}

// Check for match

function checkMatch(id) {
  const clicked = document.getElementById(id);
  const bColor = getComputedStyle(clicked).getPropertyValue("background-color");
  const main = document.getElementById("main");
  const currentC = getComputedStyle(main).getPropertyValue("color");
  const arr = [currentC === bColor, currentC, id];

  updateGame(arr);
}

// Whole game

function play() {
  const clicked = this.id;

  const board = document.getElementById("color-options");
  const childNodes = board.childNodes;
  const allChildIDs = [];

  // for (let i = 0; i < childNodes.length; i++) {
  //   allChildIDs.push(childNodes[i].childNodes[0].id);
  // }

  // const isMatched = (id) => id === "matched";
  // const allMatched = allChildIDs.every(isMatched);

  if (clicked === "start") {
    showGame();
  } else if (clicked.startsWith("element-")) {
    checkMatch(clicked);
  }
}
