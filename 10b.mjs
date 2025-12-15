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
  const state = new Array(joltages.length).fill(0);
  buttons = buttons.toSorted((a, b) => {
    return hungry(b) - hungry(a);
  });
  let machineTotal = 0;
  for (const button of buttons) {
    const min = Math.min(...button.map(index => joltages[index] - state[index]));
    console.log(`${min}: ${button}`);    
    for (const index of button) {
      state[index] += min;
    }
    console.log(state);
    machineTotal += min;
  }
  console.log(`machine total: ${machineTotal}`);
  console.log(`final state: ${state}`);
  total += machineTotal;
  function hungry(button) {
    return button.reduce((a, i) => a + ((joltages[i] > state[i]) ? 1 : 0), 0);
  }
}

console.log(total);