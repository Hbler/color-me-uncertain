import { Difficulty } from "./classes.js";

//// Dificulties
const difficulties = [
  ["easy", 2, 6],
  ["medium", 3, 8],
  ["hard", 4, 12],
  ["extreme", 1, 36],
];

let diffs = {};
for (const d of difficulties) {
  diffs[`${d[0]}`] = new Difficulty(`${d[0]}`, d[1], d[2]);
}

//// Round summary
/// Object
let allRoundsObj = {};

/// Object Updater
function registerRound(num, obj) {
  allRoundsObj[num] = obj;
}

export { diffs, allRoundsObj, registerRound };
