import lines from './lib/lines.mjs';
import Grid from './lib/grid.mjs';

const data = lines({ split: '' });
const grid = new Grid(data);

let count = 0;

for (const cell of grid.cells()) {
  if (cell.value === '@') {
    let rolls = 0;
    for (const neighbor of cell.neighbors()) {
      if (neighbor.value === '@') {
        rolls++;
      }
    }
    if (rolls < 4) {
      count++;
    }
  }
}

console.log(count);
