import lines from './lib/lines.mjs';
import Grid from './lib/grid.mjs';

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
