import lines from './lib/lines.mjs';

const data = lines();

const ingredients = new Set();
const fresh = [];

for (const row of data) {
  if (!row.length) {
    continue;
  }
  if (row.includes('-')) {
    const [low, high] = row.split('-').map(n => parseInt(n, 10));    
    fresh.push({ low, high });
    continue;
  }
  ingredients.add(parseInt(row, 10));
}

let good = 0;
for (const i of ingredients) {
  if (fresh.find(({ low, high }) => ((i >= low) && (i <= high)))) {
    good++;
  }
}

console.log(good);