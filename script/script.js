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

document.getElementById("start").addEventListener("click", displayColorOptions);

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

// Generate
function genColors(mode, amount) {
  const colors = [];
  const hue = ["red", "green", "blue"];
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
    const mono = hue[Math.floor(Math.random() * 3)];
    while (colors.length < amount) {
      switch (mono) {
        case "red":
          H = randInt(0, 100);
          break;
        case "green":
          H = randInt(140, 220);
          break;
        case "blue":
          H = randInt(260, 340);
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
  //   const rStyle = getComputedStyle(root);
  const varNames = rootVarNames.slice(0, arr.length);
  for (let i = 0; i < varNames.length; i++) {
    const v = varNames[i];
    root.style.setProperty(`--${v}`, `${arr[i]}`);
  }
}

////Fill board

function displayColorOptions(dif, arr) {
  const canvas = document.getElementById("color-options");
  const classNames = difficulties[`${dif}`];
  const limit = classNames.length;
  const root = document.querySelector(":root");
  const rStyle = getComputedStyle(root);

  if (limit === 6) {
    root.style.setProperty("--width", "120px");
  } else if (limit === 8) {
    root.style.setProperty("--width", "90px");
  } else if (limit === 12) {
    root.style.setProperty("--width", "80px");
  }

  if (limit <= 12) {
    for (let i = 0; i < limit; i++) {
      const hClass = classNames[i];
      const outerDiv = document.createElement("div");
      const hexagon = document.createElement("div");
      outerDiv.setAttribute("class", "outer");
      hexagon.setAttribute("class", "hexagon");
      hexagon.classList.add(`${hClass}`);
      outerDiv.appendChild(hexagon);
      canvas.appendChild(outerDiv);
    }
  } else {
    for (let i = 0; i < limit; i++) {
      const element = document.createElement("p");
      element.setAttribute("id", "extreme");
      element.appendChild(document.createTextNode("⧫"));
      element.style.setProperty("color", `${arr[i]}`);
      canvas.appendChild(element);
    }
  }
}
