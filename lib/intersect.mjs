// Returns true if two segments intersect on the number line
// (touching counts)

export default function intersect(a1, a2, b1, b2) {
  const sa1 = Math.min(a1, a2);
  const sa2 = Math.max(a1, a2);
  const sb1 = Math.min(b1, b2);
  const sb2 = Math.max(b1, b2);
  // on the left, or enclosing
  if (sa1 <= sb1) {
    return (sa2 >= sb1);
  } else {
    // overlapping/touching to the right
    return (sa1 <= sb2);
  }
}