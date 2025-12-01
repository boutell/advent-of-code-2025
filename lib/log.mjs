import { inspect } from 'util';

export default function log(v, depth = 100) {
  console.log(inspect(v, { depth }));
  // Helps avoid creating intermediate variables
  return v;
}

const ESC = '\u001B[';

export function write(s) {
  process.stdout.write(s);
}

export const clearScreen = `${ESC}2J`;
export const clearScrollback = `${ESC}3J`;
export const goHome = `${ESC}H`;
export const greenText = `${ESC}32m`;
export const resetText = `${ESC}0m`;
