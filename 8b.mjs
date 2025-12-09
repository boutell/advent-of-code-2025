import lines from './lib/lines.mjs';

const option = process.argv.find(a => a.startsWith('--connections='));
const connections = option ? parseInt(option.substring('--connections='.length), 10) : 1000;

const boxes = lines({ split: ',', integers: true }).map(([ x, y, z], i) => ({ x, y, z, i, c: i }));
const distances = [];

for (let i = 0; (i < boxes.length); i++) {
  for (let j = i + 1; (j < boxes.length); j++) {
    const box = boxes[i];
    const other = boxes[j];
    const dx = other.x - box.x;
    const dy = other.y - box.y;
    const dz = other.z - box.z;
    const d = Math.sqrt((dx * dx) + (dy * dy) + (dz * dz));
    distances.push({
      i,
      j,
      d
    });
  }
}

distances.sort((a, b) => {
  return a.d - b.d;
});

for (let index = 0; (index < distances.length); index++) {
  const { i, j } = distances[index];
  const ic = boxes[i].c;
  const jc = boxes[j].c;
  if (ic !== jc) {
    let last;
    for (let k = 0; (k < boxes.length); k++) {
      if (boxes[k].c === ic) {
        boxes[k].c = jc;
      }
    }
    if (!boxes.find(box => box.c !== jc)) {
      console.log(index, boxes[i].x * boxes[j].x);
      break;
    }
  }
}
