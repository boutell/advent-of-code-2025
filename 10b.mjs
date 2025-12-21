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
  const result = attempt(0, [], (new Array(joltages.length)).fill(0));
  console.log('->', result);
  total += result.reduce((a, v) => a + v, 0);
  
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
    // minimum presses for the button is the maximum of the minimum presses to satisfy each channel
    const min = Math.max(...button.map(pi => {
      let otherwise = 0;
      otherwise += state[pi];
      for (const button of buttons.slice(i + 1)) {
        if (button.some(bpi => bpi === pi)) {
          // Figure out how many more clicks are possible from this button, using the same
          // max algorithm as above, add that to "otherwise"
          const max = Math.min(...button.map(index => joltages[index] - (state[index] || 0)));
          otherwise += max;
        }
      }
      // Work out "min" for each button by subtracting "otherwise" from the joltage
      return joltages[pi] - otherwise;
    }));
    // console.log(`# ${i} ${buttons[i]} ${max} ${state}`);
    let lowest = false;
    let best;
    for (let j = min; (j <= max); j++) {
      const next = [...state];
      for (const index of button) {
        next[index] += j;
      }
      const nextPresses = [...presses, j];
      const result = attempt(i + 1, nextPresses, next);
      if (result !== false) {
        const count = result ? result.reduce((a, v) => a + v, 0) : 0;
        if ((lowest === false) || (count < lowest)) {
          lowest = count;
          best = result;
        }
      }
    }
    return best || false;
  }
}

console.log(total);