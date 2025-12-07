import key from './key.mjs';

// Pass in a function, you get back a version that remembers
// the result for a given set of arguments and doesn't
// recompute it every time

export default function memoize(fn) {
  const memos = new Map();
  return (...args) => {
    const k = key(args);
    if (memos.has(k)) {
      return memos.get(k);
    }
    const result = fn(...args);
    memos.set(k, result);
    return result;
  };
}