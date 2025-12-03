import lines from './lib/lines.mjs';

const data = lines();
const places = 12;

let sum = 0;

for (const row of data) {
  const digits = row.split('').map(digit => parseInt(digit, 10));
  const result = joltage(digits, places);
  console.log(result);
  sum += result;
}
console.log(sum);

function joltage(digits, places) {
  let best = 0;
  return find(digits, places, '');

  function find(digits, places, soFar) {
    const paddedHigh = parseInt(soFar.padEnd(soFar.length + places, '9'), 10);
    if (paddedHigh < best) {
      return 0;
    }
    const paddedLow = parseInt(soFar.padEnd(soFar.length + places, '0'), 10);
    if (paddedLow > best) {
      best = paddedLow;
    }
    if (places === 0) {
      return 0;
    }
    if (digits.length < places) {
      return 0;
    }
    if (digits.length === places) {
      return parseInt(digits.join(''), 10);
    }
    const first = digits[0];
    const rest = digits.slice(1);
    const alternatives = find(rest, places, soFar);
    const result = Math.max(alternatives, combine(first, find(rest, places - 1, `${soFar}${first}`)));
    if (result > best) {
      best = result;
    }
    return result;
  }
}

function combine(a, b) {
  if (b === 0) {
    return a;
  }
  return parseInt(`${a}${b}`, 10);
}