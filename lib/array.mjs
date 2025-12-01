export function swap(a, i1, i2) {
  const t = a[i1];
  a[i1] = a[i2];
  a[i2] = t;
}
