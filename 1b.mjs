import lines from './lib/lines.mjs';

const data = lines();

let zeroes = 0;
let pos = 50;

for (const row of data) {
  const matches = row.match(/^([A-Z])(\d+)/);
  const dir = matches[1];
  const n = parseInt(matches[2], 10);
  let delta;
  if (dir === 'L') {
    delta = -1;
  } else if (dir === 'R') {
    delta = 1;
  } else {
    throw new Error(`weird dir ${dir} in ${row}`);
  }
  for (let i = 0; (i < n); i++) {
    pos += delta;
    pos %= 100;
    if (pos === 0) {
      zeroes++;
    }
  }
}

console.log(zeroes);
