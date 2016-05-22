import test from 'tape';
import { Grid } from '../src/core';

test('Grid', (t) => {
  const defaultGrid = new Grid();
  t.equal(defaultGrid.get('x'), 0);
  t.equal(defaultGrid.get('y'), 0);

  const grid = new Grid({ x: 99, y: 10 });
  t.equal(grid.get('x'), 99);
  t.equal(grid.get('y'), 10);

  t.end();
});
