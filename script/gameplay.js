//// Listeners
document.getElementById("start").addEventListener("click", play);

//// Gameplay

// Check for match
function checkMatch(id) {
  const clicked = document.getElementById(id);
  const bColor = getComputedStyle(clicked).getPropertyValue("background-color");
  const main = document.getElementById("main");
  const currentC = getComputedStyle(main).getPropertyValue("color");
  const arr = [currentC === bColor, currentC, id];

  updateGame(arr);
}

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
  updatePoints(matched);
}

// Update points
function updatePoints(bool) {
  const pointsPara = document.getElementById("points");
  const points = pointsPara.innerHTML;
  let cPoints = +points.slice(0, 3);
  let cDif = "";
  for (let dif of difficulty.values()) {
    if (dif.checked) {
      cDif += `${dif.value}`;
    }
  }

  switch (cDif) {
    case "easy":
      if (bool) cPoints += 2;
      else if (!bool && cPoints >= 2) cPoints -= 2;
      break;
    case "medium":
      if (bool) cPoints += 3;
      else if (!bool && cPoints >= 3) cPoints -= 3;
      break;
    case "hard":
      if (bool) cPoints += 4;
      else if (!bool && cPoints >= 4) cPoints -= 4;
      break;
    case "extreme":
      if (bool) cPoints += 1;
      else if (!bool && cPoints >= 1) cPoints -= 1;
      break;
  }

  if (cPoints < 10)
    pointsPara.innerHTML = `0${cPoints} <strong>Points</strong>`;
  else pointsPara.innerHTML = `${cPoints} <strong>Points</strong>`;
}

// Check for round end
function roundEnd() {
  const board = document.getElementById("color-options");
  const childNodes = board.childNodes;
  const allChildIDs = [];
  for (let i = 0; i < childNodes.length - 1; i++) {
    allChildIDs.push(childNodes[i].childNodes[0].id);
  }

  const isMatched = (id) => id === "matched";
  const allMatched = allChildIDs.filter(isMatched).length;

  return childNodes.length - 1 === allMatched;
}

// Whole game
function play() {
  const clicked = this.id;
  const roundsPara = document.getElementById("rounds");
  const rounds = roundsPara.innerHTML;
  let round = +rounds.slice(-3);

  const nextRound = roundEnd();

  if (clicked === "start") {
    showGame();
  } else if (clicked.startsWith("element-")) {
    checkMatch(clicked);
  }

  if (nextRound) {
    round++;
    if (round < 10) roundsPara.innerHTML = `<strong>Round</strong> 0${round}`;
    else roundsPara.innerHTML = `<strong>Round</strong> ${round}`;
  }
}
