import { readFileSync } from 'fs';

export default function({ nonempty = true, split = false, integers = false, inObjects = false } = {}) {
  const input = readFileSync('/dev/stdin', 'utf8');
  const lines = input.split('\n').filter(line => nonempty ? (line.length > 0) : true);
  if (split !== false) {
    return lines.map(line => line.split((split === true) ? /\s+/ : split).map(transform));
  }
  return lines.map(transform);
  function transform(v) {
    let result = integers ? parseInt(v) : v;
    return inObjects ? { value: result } : result;
  }
}

