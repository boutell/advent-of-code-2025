// Returns a new function that logs both its arguments
// and its return value

export default function spy(fn) {
  return (...args) => {
    console.log(`> ${JSON.stringify(args)}`);
    const result = fn(...args);
    console.log(`< ${JSON.stringify(result)}`);
    return result;
  }
}