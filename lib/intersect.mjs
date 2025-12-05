// Returns true if two ordered segments intersect on the number line
// (touching counts)

export default function intersect(a1, a2, b1, b2) {
  // on the left, or enclosing
  if (a1 <= b1) {
    return (a2 >= b1);
  } else {
    // overlapping/touching to the right
    return (a1 <= b2);
  }
}