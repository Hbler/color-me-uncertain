//// Array and Objects
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

let mode = document.getElementsByName("mode");
let difficulty = document.getElementsByName("difficulty");

//// Support Functions
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
