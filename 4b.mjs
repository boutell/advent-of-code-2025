import lines from './lib/lines.mjs';
import Grid from './lib/grid.mjs';

const data = lines({ split: '' });
const grid = new Grid(data);

let removed = 0;
while (true) {
  const fresh = remove();
  if (fresh === 0) {
    break;
  }
  removed += fresh;
}

console.log(removed);

function remove() {
  let removable = [];
  for (const cell of grid.cells()) {
    if (cell.value === '@') {
      let rolls = 0;
      for (const neighbor of cell.neighbors()) {
        if (neighbor.value === '@') {
          rolls++;
        }
      }
      if (rolls < 4) {
        removable.push(cell);
      }
    }
  }
  for (const roll of removable) {
    roll.value = '.';
  }
  return removable.length;
}
