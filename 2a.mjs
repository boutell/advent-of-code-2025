import lines from './lib/lines.mjs';

const data = lines({ separator: ',', split: '-' });

let sum = 0;

for (const range of data) {
  const low = parseInt(range[0], 10);
  const high = parseInt(range[1], 10);
  for (let i = low; (i <= high); i++) {
    const s = i.toString();
    if (s.length % 2) {
      continue;
    }
    if (s.substring(0, s.length / 2) !== s.substring(s.length / 2)) {
      continue;
    }
    sum += i;
  }
}

console.log(sum);
