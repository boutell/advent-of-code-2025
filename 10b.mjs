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

let total = 0

for (const { joltages, buttons } of machines) {
  const state = new Array(joltages.length).fill(0);
  const seen = new Map();
  let best = false;
  attempt(state, []);
  total += best;
  function attempt(state, steps) {
    for (let i = 0; (i < joltages.length); i++) {
      if (state[i] > joltages[i]) {
        // Overshot the goal
        return;
      }
    }
    let good = true;
    for (let i = 0; (i < joltages.length); i++) {
      if (joltages[i] !== state[i]) {
        good = false;
        break;
      }
    }
    if (good) {
      if ((best === false) || (steps < best)) {
        console.log(`${joltages.join(',')} win at ${good}`);
        best = steps;
      }
      return;
    }

    const key = state.join(',');
    if (seen.has(key)) {
      const depth = seen.get(key);
      if (depth <= steps) {
        return;
      }
    }
    seen.set(key, steps);
    if ((best !== false) && (steps >= best)) {
      return;
    }
    for (const button of buttons) {
      const next = [...state];
      for (const index of button) {
        next[index]++;
      }
      attempt(next, steps + 1);
    }
  }
}

console.log(total);