import lines from './lib/lines.mjs';

const data = lines();

let sum = 0;

for (const row of data) {
  const digits = row.split('').map(digit => parseInt(digit, 10));
  const result = find(digits);
  console.log(result);
  sum += result;
}
console.log(sum);

function find(digits) {
  if (digits.length === 2) {
    return parseInt(`${digits[0]}${digits[1]}`, 10);
  }
  const first = digits[0];
  const rest = digits.slice(1);
  const alternatives = find(rest);
  return Math.max(alternatives, ...rest.map(digit => parseInt(`${first}${digit}`, 10)));
}
