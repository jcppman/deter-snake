import test from 'tape';
import lolex from 'lolex';
import events from 'events';
import { Driver } from '../src/driver';

test('constructor', (t) => {
  const driver = new Driver();
  t.ok(driver instanceof events.EventEmitter, 'is an event emitter');
  t.end();
});

test('start & pause', (t) => {
  t.plan(6);
  const timer = lolex.install();

  const driver = new Driver();

  const direction = driver.direction;
  driver.start();
  driver.on('tick', () => {
    t.pass('ticked once');
    t.equal(direction, driver.direction, 'should be the same direction');
  });
  timer.tick(3500);

  driver.pause();
  driver.removeAllListeners();

  driver.on('tick', () => {
    t.fail('no more tick');
  });
  timer.tick(3500);

  timer.uninstall();
  t.end();
});

test('updateSeed', (t) => {
  const timer = lolex.install();

  const driver = new Driver();
  const beforeSeed = driver.seed;

  timer.tick(100);

  driver.updateSeed();

  t.notEqual(driver.seed, beforeSeed, 'should update seed');

  timer.uninstall();

  t.end();
});

test('changeDirection once per tick', (t) => {
  t.plan(4);
  const timer = lolex.install();

  const driver = new Driver();
  const target = ['right', 'left', 'up', 'down'];
  driver.start();
  driver.on('tick', (data) => {
    t.equal(data.direction, target[0]);
    target.shift();
    if (target.length) {
      driver.changeDirection(target[0]);
    }
  });
  timer.tick(4500);
  driver.pause();

  timer.uninstall();
  t.end();
});

test('changeDirection twice per tick', (t) => {
  t.plan(2);
  const timer = lolex.install();

  const driver = new Driver();
  driver.start();
  driver.once('tick', (data) => {
    t.equal(data.direction, 'right');
    driver.changeDirection('left');
    setTimeout(() => {
      driver.changeDirection('up');
    }, 200);
    driver.once('tick', (data2) => {
      t.equal(data2.direction, 'up');
    });
  });
  timer.tick(4500);
  driver.pause();

  timer.uninstall();
  t.end();
});
