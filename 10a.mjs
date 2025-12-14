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

for (const { lights, buttons } of machines) {
  const state = new Array(lights.length).fill('.');
  const seen = new Map();
  let best = false;
  attempt(state, 0);
  total += best;
  function attempt(state, steps) {
    let good = true;
    for (let i = 0; (i < lights.length); i++) {
      if (lights[i] !== state[i]) {
        good = false;
        break;
      }
    }
    if (good) {
      if ((best === false) || (steps < best)) {
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
      for (const light of button) {
        if (state[light] === '.') {
          next[light] = '#';
        } else {
          next[light] = '.';
        }
      }
      attempt(next, steps + 1);
    }
  }
}

console.log(total);