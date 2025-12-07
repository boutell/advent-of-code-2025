import lines from './lib/lines.mjs';
import Grid from './lib/grid.mjs';
import memoize from './lib/memoize.mjs';

const data = lines({ split: '' });
let grid = new Grid(data);

let change = false;
let splits = 0;

for (let y = 0; (y < grid.height - 1); y++) {
  const next = grid.clone();
  for (let x = 0; (x < grid.width); x++) {
    const value = grid.getValue(x, y);
    if (value === 'S') {
      const beam = next.get(x, y + 1);
      beam.value = '|';
      change = true;
    } else if (value === '|') {
      if (grid.getValue(x, y + 1) === '^') {
        splits++;
        const lx = x - 1;
        const rx = x + 1;
        split(lx);
        split(rx);
        function split(x) {
          if (next.inBounds(x, y + 1)) {
            setIfChanged(x, y + 1, '|');
          }
        }
      } else {
        setIfChanged(x, y + 1, '|');
      }
    }
  }
  grid = next;
  function setIfChanged(x, y, value) {
    if (grid.getValue(x, y) !== value) {
      next.setValue(x, y, value);
      change = true;
    }
  }
}

grid.print();

console.log(splits);

let x;
for (const cell of grid.cells()) {
  if (cell.value === 'S') {
    x = cell.x;
    break;
  }
}
if (!x) {
  throw new Error('no S found');
}

const count = memoize(countBody);

console.log(count(x, 0));

function countBody(x, y) {
  if (!grid.inBounds(x, y)) {
    return 0;
  }
  const ny = y + 1;
  if (!grid.inBounds(x, ny)) {
    return 1;
  }
  if (grid.getValue(x, ny) === '^') {
    return count(x - 1, ny) + count(x + 1, ny);
  } else {
    return count(x, ny);
  }
}
