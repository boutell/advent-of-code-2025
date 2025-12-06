import lines from './lib/lines.mjs';

const data = lines();

console.log(data);

const last = data.at(-1);
const problems = [];
for (let i = 0; (i < last.length); i++) {
  const char = last.charAt(i);
  if (char !== ' ') {
    problems.push({
      operator: char,
      col: i,
      inputs: []
    });
  }
}

console.log(problems);

const inputs = data.slice(0, data.length - 1);
let width = inputs.reduce((a, input) => Math.max(a, input.length), 0);
let lastCol = width;
for (let i = problems.length - 1; (i >= 0); i--) {
  const col = problems[i].col;
  for (let c = col; (c < lastCol); c++) {
    let value = '';
    for (const input of inputs) {
      value += input.charAt(c);
    }
    value = value.trim();
    if (value.length > 0) {
      problems[i].inputs.push(value);
    }
  }
  lastCol = col;
}

console.log(problems);

const sum = problems.reduce((a, problem) => a + apply(problem.operator, problem.inputs), 0);

console.log(sum);

function apply(operator, inputs) {
  let result = (operator === '*') ? 1 : 0;
  for (let input of inputs) {
    input = parseInt(input, 10);
    if (operator === '*') {
      result *= input;
    } else {
      result += input;
    }
  }
  console.log(result);
  return result;
}

