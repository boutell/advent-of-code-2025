import lines from './lib/lines.mjs';

const data = lines();

let zeroes = 0;
let pos = 50;

for (const row of data) {
  const matches = row.match(/^([A-Z])(\d+)/);
  const dir = matches[1];
  const n = parseInt(matches[2], 10);
  if (dir === 'L') {
    pos -= n;
  } else if (dir === 'R') {
    pos += n;
  } else {
    throw new Error(`weird dir ${dir} in ${row}`);
  }
  pos %= 100;
  if (pos === 0) {
    zeroes++;
  }
}

console.log(zeroes);
