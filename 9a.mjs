import lines from './lib/lines.mjs';

const data = lines({ split: ',', integers: true }).map(([ x, y ]) => ({ x, y }));

let largest = 0;

for (const { x, y } of data) {
  for (const { x: ox, y: oy } of data) {
    const area = (Math.abs(ox - x) + 1) * (Math.abs(oy - y) + 1);
    if (area > largest) {
      largest = area;
    }
  }
}

console.log(largest);