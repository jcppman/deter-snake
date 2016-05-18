import test from 'tape';
import Immutable from 'immutable';

test('setting test', (t) => {
  t.plan(1);

  const a = Immutable.Map({
    a: 1,
    b: 2,
  });

  const b = a.set('b', 2);

  t.ok(Immutable.is(a, b));
});
