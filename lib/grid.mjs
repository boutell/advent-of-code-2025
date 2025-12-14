import log from './log.mjs';

export class GridBoundsError extends Error {
  constructor(x, y) {
    super(`Out of bounds at ${x},${y}`);
    this.name = 'GridBoundsError';
  }
}

class Grid {
  constructor(data) {
    if (data) {
      this.data = data;
      this.height = data.length;
      this.width = data[0].length;
      this.top = 0;
      this.left = 0;
      this.right = this.width - 1;
      this.bottom = this.height - 1;
    }
  }
  static sized(width, height) {
    const data = [];
    for (let y = 0; (y < height); y++) {
      const row = [];
      for (let x = 0; (x < width); x++) {
        row.push('.');
      }
      data.push(row);
    }
    return new Grid(data);
  }
  clone() {
    const data = structuredClone(this.data);
    const grid = new Grid(data);
    return grid;
  }
  // Returns an iterator over the cells in the grid
  cells() {
    const self = this;
    function* generate() {
      for (let y = self.top; (y <= self.bottom); y++) {
        for (let x = self.left; (x <= self.right); x++) {
          yield self.get(x, y);
        }
      }
    }
    return generate();
  }
  // Returns a cell, with a "value" setter and getter and
  // useful iterators for accessing neighbors
  get(x, y) {
    if (!this.inBounds(x, y)) {
      throw new GridBoundsError(x, y);
    }
    return new Cell(this, x, y);
  }
  // Get just the value
  getValue(x, y) {
    if (!this.inBounds(x, y)) {
      throw new GridBoundsError(x, y);
    }
    return this.data[y][x];
  }
  // More convenient than .get(x, y).value = v
  setValue(x, y, value) {
    if (!this.inBounds(x, y)) {
      throw new GridBoundsError(x, y);
    }
    this.data[y][x] = value;
  }
  inBounds(x, y) {
    if ((typeof x) !== 'number') {
      throw new Error('x is not a number:', x);
    }
    if ((typeof y) !== 'number') {
      throw new Error('y is not a number:', x);
    }
    if ((y < this.top) || (y > this.bottom)) {
      return false;
    }
    if ((x < this.left) || (x > this.right)) {
      return false;
    }
    return true;
  }
  print({
    format = (v) => v?.value || v || ' ',
    extras = []
  } = {}) {
    for (let y = this.top; (y <= this.bottom); y++) {
      let s = '';
      for (let x = this.left; (x <= this.right); x++) {
        const extra = extras.find(extra => (x === extra.x) && (y === extra.y));
        s += format(extra ? extra.value : this.getValue(x, y));
      }
      console.log(s);
    }
  }
  // returns true if the characters in "message" are
  // written in the cells starting at x, y going in the
  // direction xd, yd
  matches(x, y, xd, yd, message) {
    for (const ch of message) {
      if (this.getValue(x, y) !== ch) {
        return false;
      }
      x += xd;
      y += yd;
    }
    return true;
  }
  // The value of each cell must be a mutable object.
  // The value of the starting cell must have a
  // numeric "d" property usually starting at zero. isWalkable
  // must return true when given a value that is considered
  // "walkable" (not a wall, etc). Upon return, every
  // reachable walkable cell's value has an integer
  // "d" property.
  //
  // isWalkable receives (value, neighboringValue) where
  // value is the value of the cell being tested and
  // neighboringValue is that of a neighboring cell already
  // known to be walkable. This allows taking rules about
  // the values of adjoining cells into account.
  //
  // Hint: use inObjects when calling lines() to create wrapper objects.
  shortestPath(isWalkable) {
    let change;
    do {
      change = false;
      for (const cell of this.cells()) {
        if ((typeof cell.value.d) === 'number') {
          for (const n of cell.taxi()) {
            const value = n.value;
            if (isWalkable(value, cell.value) && (((typeof value.d) !== 'number') || (value.d > cell.value.d + 1))) {
              value.d = cell.value.d + 1;
              change = true;
            }
          }
        }
      }
    } while (change);
  }
  // Give each cell a region id. Adjacent cells that satisfy
  // sameRegion(cell1, cell2) will be given the same region id.
  // Note that noncontiguous regions will not have the same
  // region id.
  //
  // The region id will be in .value.region after the call. The
  // default sameRegion function compares .value.value (use
  // inObjects when calling lines() to create wrapper objects).
  //
  // An alternate prop name can be passed via the optional second argument.
  regions(sameRegion = (a, b) => a.value.value === b.value.value, regionProp = 'region') {
    let change;
    let next = 0;
    do {
      change = false;
      for (const cell of this.cells()) {
        if (cell.value[regionProp] === undefined) {
          cell.value[regionProp] = next++;
        }
        for (const n of cell.taxi()) {
          if (sameRegion(cell, n) && (n.value[regionProp] !== cell.value[regionProp])) {
            const best = (n.value[regionProp] !== undefined) ? Math.min(cell.value[regionProp], n.value[regionProp]) : cell.value[regionProp];
            cell.value[regionProp] = best;
            n.value[regionProp] = best;
            change = true;
          }
        }
      }
    } while (change);
  }
}

// Cell objects are returned by grid.get() and offer
// a convenient .value getter and setter as well
// as iterators over neighboring cells

class Cell {
  constructor(grid, x, y) {
    this.grid = grid;
    this.x = x;
    this.y = y;
  }
  get value() {
    return this.grid.getValue(this.x, this.y);
  }
  set value(v) {
    this.grid.setValue(this.x, this.y, v);
  }
  // Returns an iterator over the neighboring cells
  neighbors() {
    const self = this;
    function* generate() {
      for (let y = self.y - 1; (y <= self.y + 1); y++) {
        for (let x = self.x - 1; (x <= self.x + 1); x++) {
          if ((y === self.y) && (x === self.x)) {
            continue;
          }
          if (!self.grid.inBounds(x, y)) {
            continue;
          }
          yield self.grid.get(x, y);
        }
      }
    }
    return generate();
  }
  // Like neighbors, but for taxicab directions only
  // (no diagonals)
  taxi() {
    const self = this;
    const dirs = [
      [ 0, -1 ],
      [ 1, 0 ],
      [ 0, 1 ],
      [ -1, 0 ]
    ];
    function* generate() {
      for (const [xd, yd ] of dirs) {
        const x = self.x + xd;
        const y = self.y + yd;
        if (!self.grid.inBounds(x, y)) {
          continue;
        }
        yield self.grid.get(x, y);
      }
    }
    return generate();
  }
  // Returns an iterator over all cells in a given direction.
  // Use -1, 0 to walk left, etc.
  walkFrom(dx, dy) {
    // "this" isn't bound inside generate()
    const self = this;
    function* generate() {
      let x = self.x + dx;
      let y = self.y + dy;
      while (self.grid.inBounds(x, y)) {
        yield self.grid.get(x, y);
        x += dx;
        y += dy;
      }
    }
    return generate();
  }
  // Return the adjoining cell in the given direction.
  // Returns false if the direction is out of bounds
  step(dx, dy) {
    let x = this.x + dx;
    let y = this.y + dy;
    if (!this.grid.inBounds(x, y)) {
      return false;
    }
    return this.grid.get(x, y);
  }
}

export default Grid;

export const taxiDirections = [
  [ 0, -1 ],
  [ 1, 0 ],
  [ 0, 1 ],
  [ -1, 0 ]
];

export const diagonalDirections = [
  [ 1, -1 ],
  [ 1, 1 ],
  [ -1, 1 ],
  [ -1, -1 ]
];

export const allDirections = [
  [ 0, -1 ],
  [ 1, -1 ],
  [ 1, 0 ],
  [ 1, 1 ],
  [ 0, 1 ],
  [ -1, 1 ],
  [ -1, 0 ],
  [ -1, -1 ]
];
