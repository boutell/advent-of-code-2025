// Returns true if segment 1 fully contains segment 2
// (two equal segments do contain each other)

export default function contain(a1, a2, b1, b2) {
  const sa1 = Math.min(a1, a2);
  const sa2 = Math.max(a1, a2);
  const sb1 = Math.min(b1, b2);
  const sb2 = Math.max(b2, b2);
  return (sa1 <= sb1) && (sa2 >= sb2);
}