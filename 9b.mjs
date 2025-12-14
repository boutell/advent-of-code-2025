import lines from './lib/lines.mjs';
import intersect from './lib/intersect.mjs';
import contain from './lib/contain.mjs';

const data = lines({ split: ',', integers: true }).map(([ x, y ]) => ({ x, y }));

// OK, so I have two corner tabs, and I want to know if there's
// uninterrupted interior space between them.
//
// So I loop from y1 to y2.
//
// For each line I calculate the segments that are interior and
// coalesce them.
//
// Then I check whether x1 to x2 is fully enclosed by one of those
// segments or not.
//
// I return true if there are no exceptions.
//
// OK, so to do this "rasterization" I need to look at all of the
// segments that make up the polygon.
//
// If a segment is entirely above or below the scanline I can ignore it.
//
// If a segment intersects the scanline then I must determine its
// extent sx1 - sx2. For vertical segments it's a single point, for
// horizontal segments it's a range.
//
// Then I need to figure out "interior" versus "exterior."
//
// First sort by sx1, from left to right. Then iterate over the
// segments and start building a "coverage list."
//
// Horizontal segments are "freebies." They constitute coverage but
// don't change the interior/exterior flag.
//
// Vertical segments constitute one point of coverage, *and they
// toggle the interior/exterior flag.
//
// Gaps between vertical segments count as "interior coverage." Note that
// sometimes horizontal segments will duplicate "interior coverage."
// That's fine.
//
// Now coalesce the coverage list.
//
// Now confirm that it fully contains x1:x2, inclusive.

let largest = 0;
let winner;

const total = data.length * data.length;
console.log(`Total of ${total}`);

// console.log(interior(9, 5, 2, 3));

let i = 0;
for (const { x, y } of data) {
  for (const { x: ox, y: oy } of data) {
    const area = (Math.abs(ox - x) + 1) * (Math.abs(oy - y) + 1);
    if (area > largest) {
      if (interior(x, y, ox, oy)) {
        winner = { x, y, ox, oy };
        largest = area;
      }
    }
    i++;
    if (!(i % 100)) {
      console.log(`${i} of ${total}`);
    }
  }
}

console.log(largest);
console.log(winner);

function interior(x, y, ox, oy) {
  const y1 = Math.min(y, oy);
  const y2 = Math.max(y, oy);
  const x1 = Math.min(x, ox);
  const x2 = Math.max(x, ox);

  for (let y = y1; (y <= y2); y++) {
    // Find the intercepts
    let lastPoint = null;
    let intercepts = [];
    for (const point of data) {
      if (lastPoint) {
        line(lastPoint.x, lastPoint.y, point.x, point.y);
      }
      lastPoint = point;
    }
    line(lastPoint.x, lastPoint.y, data[0].x, data[0].y);

    intercepts.sort((a, b) => {
      const d1 = a.x1 - b.x1;
      if (d1 !== 0) {
        return d1;
      }
      const d2 = a.x2 - b.x2;
      return d2;
    });

    // Create segments using the even/odd rule
    const segments = [];
    let interior = false;
    let lastIntercept = false;
    for (const intercept of intercepts) {
      if (intercept.x1 !== intercept.x2) {
        // Horizontal segment
        interior = !interior;
        lastIntercept = false;
        segments.push(intercept);
      } else {
        if (interior) {
          segments.push({
            x1: lastIntercept.x1,
            x2: intercept.x1
          });
        }
        interior = !interior;
        lastIntercept = intercept;
      }
    }

    // merge segments
    const merged = [];
    let last = false;
    for (const segment of segments) {
      if (last && (last.x2 === segment.x1)) {
        last.x2 = segment.x2;
      } else {
        merged.push(segment);
      }
      last = segment;
    }
    
    const contains = merged.find(segment => contain(segment.x1, segment.x2, x1, x2));
    if (!contains) {
      return false;
    }

    function line(x1, y1, x2, y2) {
      if (!intersect(y, y, y1, y2)) {
        return;
      }
      intercepts.push({ x1, x2 });
    }
  }
  return true;
}
