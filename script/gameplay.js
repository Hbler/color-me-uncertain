//// Listeners
document.getElementById("start").addEventListener("click", play);

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
    console.log(colorArr.indexOf(`${color}`));
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
