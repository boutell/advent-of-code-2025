import lines from './lib/lines.mjs';
import intersect from './lib/intersect.mjs';

const data = lines();

const ingredients = new Set();
let fresh = [];

for (const row of data) {
  if (!row.length) {
    continue;
  }
  if (row.includes('-')) {
    const [low, high] = row.split('-').map(n => parseInt(n, 10));    
    fresh.push({ low, high });
    continue;
  }
}

while (true) {
  let change = false;
  loop: for (let i = 0; (i < fresh.length); i++) {
    let found = false;
    for (let j = i + 1; (j < fresh.length); j++) {
      if (intersect(fresh[i].low, fresh[i].high, fresh[j].low, fresh[j].high)) {
        fresh = [
          ...fresh.filter(f => (f !== fresh[j]) && (f !== fresh[i])), 
          {
            low: Math.min(fresh[i].low, fresh[j].low),
            high: Math.max(fresh[i].high, fresh[j].high)
          }
        ];
        change = true;
        break loop;
      }
    }
  }
  if (!change) {
    break;
  }
}

let total = 0;
for (const range of fresh) {
  total += (range.high - range.low) + 1;
}
console.log(total);