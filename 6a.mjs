import lines from './lib/lines.mjs';

const data = lines({ split: true });

console.log(data);

const last = data.at(-1);
const problems = last.map(char => ({
  operator: char,
  inputs: []
}));

console.log(problems);

for (const input of data.slice(0, data.length - 1)) {
  for (let i = 0; (i < input.length); i++) {
    problems[i].inputs.push(input[i]);
  }
}

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

