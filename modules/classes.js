import { randInt, HSLToRGB } from "./support.js";

class Difficulty {
  self;
  points;
  elements;
  constructor(self, points, elements) {
    this.self = self;
    this.points = points;
    this.elements = elements;
  }
}

class ColorGen {
  mode;
  diff;
  constructor(mode, diff) {
    this.mode = mode;
    this.diff = diff;
    this.hues = ["red", "yellow", "green", "cyan", "blue", "magenta"];
    this.genColors();
  }

  // list = this.genColors();

  get colors() {
    const hslList = this.genColors();
    const rgbList = hslList.map((c) => HSLToRGB(`${c}`));
    return [hslList, rgbList];
  }

  // Methods
  genColors() {
    const amount = this.diff.elements;
    const colorList = [];
    let H, L, S, newColor;

    if (this.mode === "random") {
      while (colorList.length < amount) {
        H = randInt(0, 360);
        S = randInt(20, 100);
        L = randInt(40, 60);
        newColor = `hsl(${H},${S}%,${L}%)`;
        colorList.push(newColor);
      }
    } else if (this.mode === "mono") {
      const mono = this.hues[Math.floor(Math.random() * this.hues.length)];
      while (colorList.length < amount) {
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
        colorList.push(newColor);
      }
    }
    return colorList;
  }
}

class Element {
  id;
  hsl;
  rgb;
  diff;
  icons = ["▀", "▄", "█", "◼", "▮", "▪"];
  constructor(id, hsl, rgb, diff) {
    this.id = id;
    this.hsl = hsl;
    this.rgb = rgb;
    this.diff = diff;
  }

  get icon() {
    switch (this.diff) {
      case "easy":
        const easy = randInt(0, 5);
        return this.icons[easy];
      case "medium":
        const medium = randInt(0, 4);
        return this.icons[medium];
      case "hard":
        const hard = randInt(0, 3);
        return this.icons[hard];
      case "extreme":
        const extreme = randInt(0, 2);
        return this.icons[extreme];
    }
  }
}

class Round {
  round;
  tPoints;
  pointsWon;
  pointsLost;
  eTime;
  constructor(round, tPoints, pointsWon, pointsLost, eTime) {
    this.round = round;
    this.tPoints = tPoints;
    this.pointsWon = pointsWon;
    this.pointsLost = pointsLost;
    this.eTime = eTime;
  }

  get summary() {
    const time = this.convertTime();
    return [
      `End of Round 0${this.round}`,
      `Current Score: ${this.tPoints} Points`,
      `Points Won: ${this.pointsWon}`,
      `Points Lost: ${this.pointsLost}`,
      `You took ${time} to finish it.`,
    ];
  }

  // Methods
  convertTime() {
    const time = this.eTime;

    switch (time) {
      case time > 60000:
        return `${(time / 60000).toFixed(2)} minutes`;
      default:
        return `${(time / 1000).toFixed(2)} seconds`;
    }
  }
}

export { Difficulty, ColorGen, Element, Round };
