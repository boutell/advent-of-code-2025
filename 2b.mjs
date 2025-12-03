import lines from './lib/lines.mjs';

const data = lines({ separator: ',', split: '-' });

let sum = 0;

for (const range of data) {
  const low = parseInt(range[0], 10);
  const high = parseInt(range[1], 10);
  for (let i = low; (i <= high); i++) {
    const s = i.toString();
    for (let len = 1; (len < s.length); len++) {
      let c = '';
      while (c.length < s.length) {
        c += s.substring(0, len);
      }
      if (c === s) {
        sum += i;
        break;
      }
    }
  }
}

console.log(sum);
