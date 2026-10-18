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

for (const machine of machines) {
  const submachines = subset(machine);
  let total = 0;
  console.log('---');
  for (const { joltages, buttons } of submachines) {
    console.log('joltages:', joltages, 'buttons:', buttons);
    const result = attempt(0, (new Array(joltages.length)).fill(0));
    console.log('->', result);
    total += result;
    
    function attempt(i, state) {
      if (joltages.join(',') === state.join(',')) {
        return 0;
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
          if (button == null) {
            continue;
          }
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
      for (let j = Math.max(min, 0); (j <= max); j++) {
        const next = [...state];
        for (const index of button) {
          next[index] += j;
        }
        const result = attempt(i + 1, next);
        if (result !== false) {
          const count = j + result;
          if ((lowest === false) || (count < lowest)) {
            lowest = count;
          }
        }
      }
      return lowest;
    }
  }
}

console.log(total);

function subset({ joltages, buttons }) {
  let machines = [];
  for (const button of buttons) {
    let machine = machines.find(machine =>
      machine.buttons.flat().find(c =>
        button.find(bc => bc === c)
      )
    );
    if (!machine) {
      machine = { joltages: (new Array(joltages.length)).fill(0), buttons: [] };
      machines.push(machine);
    }
    machine.buttons.push(button);
    for (const i of button) {
      machine.joltages[i] = joltages[i];
    }
  }
  let change;
  do {
    change = false;
    const next = [];
    for (let i = 0; (i < machines.length); i++) {
      const mi = machines[i];
      let match = false;
      if (mi.merged) {
        continue;
      }
      for (let j = i + 1; (j < machines.length); j++) {
        const mj = machines[j];
        if (mj.merged) {
          continue;
        }
        const bi = machines[i].buttons.flat();
        const bj = machines[j].buttons.flat();
        if (bi.some(bii => bj.some(bji => bji === bii))) {
          match = mj;
        }
      }
      if (match) {
        const mj = match;
        const nextJoltages = [];
        for (let k = 0; (k < joltages.length); k++) {
          nextJoltages[k] = mi.joltages[k] + mj.joltages[k];
        }
        const nm = {
          joltages,
          buttons: [...mi.buttons, ...mj.buttons]
        };
        mj.merged = true;
        change = true;
        next.push(nm);
      } else {
        next.push(mi);
      }
    }
    machines = next;
  } while (change);
  console.log('MACHINES:', machines.length);
  return machines;  
}