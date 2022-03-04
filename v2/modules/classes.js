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

const difficulties = [
  ["easy", 2, 6],
  ["medium", 3, 8],
  ["hard", 4, 12],
  ["extreme", 1, 36],
];

// class instances
let diffs = {};
for (const d of difficulties) {
  diffs[`${d[0]}`] = new Difficulty(`${d[0]}`, d[1], d[2]);
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
  icons = ["▀", "▄", "█"];
  constructor(id, hsl, rgb) {
    this.id = id;
    this.hsl = hsl;
    this.rgb = rgb;
  }

  get icon() {
    return this.icons[Math.floor(Math.random() * this.icons.length)];
  }
}

export { diffs, ColorGen, Element };
