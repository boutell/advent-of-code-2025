// Use the button that increments the most channels first, until you saturate a channel.
// Then use the one that increments the next most channels without taking any over,
// and so on, until you're hitting one-shot buttons if necessary. This will always
// produce the lowest button count.

import lines from './lib/lines.mjs';

const data = lines();

const machines = data.map(datum => {
  const matches = datum.match(/\[([\.#]+)\](( \([\d,]+\))+) {([\d,]+)}$/);
  return {
    lights: matches[1].split(''),
    buttons: matches[2].trim().replace(/[\(\)]/g, '').split(' ').map(
      button => button.split(',').map(val => parseInt(val, 10))
    ),
    joltages: matches.at(-1).split(',').map(val => parseInt(val, 10))
  };
});

let total = 0;

for (let { joltages, buttons } of machines) {
  console.log('machine:', joltages);
  const result = attempt(0, 0, (new Array(joltages.length)).fill(0));
  console.log('->', result);
  total += result;
  function attempt(i, presses, state) {
    if (joltages.join(',') === state.join(',')) {
      return presses;
    }
    const button = buttons[i];
    if (!button) {
      return false;
    }
    // max presses is the min of the remaining joltage of the connected channels
    const max = Math.min(...button.map(index => joltages[index] - (state[index] || 0)));
    if (max === 0) {
      return false;
    }
    // console.log(`# ${i} ${buttons[i]} ${max} ${state}`);
    let lowest = false;
    for (let j = 0; (j <= max); j++) {
      const next = [...state];
      for (const index of button) {
        next[index] += j;
      }
      const result = attempt(i + 1, presses + j, next);
      if (result !== false) {
        if ((lowest === false) || (result < lowest)) {
          lowest = result;
        }
      }
    }
    return lowest;
  }
}

console.log(total);