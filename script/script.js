//// Variables

// Array and Objects
const hexComps = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "0",
];
const colors = [
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
  extreme: 36,
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

// Generate
function genColors(mode, amount) {
  const colors = [];
  const index = [1, 3, 5];

  // Generating needed amout of colors
  while (colors.length < amount) {
    const newColor = ["#"];
    for (let i = 1; i <= 6; i++) {
      const rHex = Math.floor(Math.random() * hexComps.length);
      newColor.push(hexComps[rHex]);
    }
    colors.push(newColor);
  }

  //Checking for mode
  if (mode === "similar") {
    const rIndex = index[Math.floor(Math.random() * 3)];
    const mHexA = hexComps[Math.floor(Math.random() * 15)],
      mHexB = hexComps[Math.floor(Math.random() * 15)];
    for (let i = 0; i < colors.length; i++) {
      const c = colors[i];
      c.splice(rIndex, 2, mHexA, mHexB);
    }
  }

  const generatedColors = colors.map((x) => x.join(""));
  return generatedColors;
}

// Update Variables
// Main Color
function updateMainColor(arr) {
  const nextC = arr[Math.floor(Math.random() * arr.length)];
  const root = document.querySelector(":root");
  root.style.setProperty("--mainColor", `${nextC}`);
}
// Hexagons
function updateRootVar(colArr) {
  const root = document.querySelector(":root");
  //   const rStyle = getComputedStyle(root);
  const cLimit = colors.slice(0, colArr.length);
  for (let i = 0; i < cLimit.length; i++) {
    const c = cLimit[i];
    root.style.setProperty(`--${c}`, `${colArr[i]}`);
  }
}

////Fill board

function displayColorOptions(dif) {
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
}

let test = setGameParams();
let test1 = difficulties[test[1]];

displayColorOptions(test1);
