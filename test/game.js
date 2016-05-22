/*eslint no-unused-vars: false*/

import test from 'tape';
import Immutable from 'immutable';
import { Grid, Game } from '../src/core';
import { gameDefaults } from '../src/defaults';

test('constructor', (t) => {
  t.test('defaults', (st) => {
    const game = new Game();
    const {
      width,
      height,
      initialSnake,
      direction,
      snake,
      spaces,
      food,
      score,
      status,
      scoreStep,
    } = game;

    st.deepEqual({
      width,
      height,
      initialSnake,
      direction,
      scoreStep,
    }, gameDefaults, 'should have default configs');

    st.ok(Immutable.List.isList(snake), 'snake should be an Imu List');
    st.ok(Immutable.Set.isSet(spaces), 'spaces should be an Imu Set');
    st.equal(food, null, 'should not have food');
    st.equal(score, 0, 'score should be zero');
    st.equal(status, 'new', 'status should be new');

    st.end();
  });

  t.test('invalid configs', (st) => {
    st.plan(2);

    st.throws(() => {
      const game = new Game({
        width: 5,
        initialSnake: 10,
      });
    }, /width/, 'should throw if width smaller than initialSnake');

    st.throws(() => {
      const game = new Game({
        height: 0,
      });
    }, /height/, 'should throw if height less than 1');
  });

  t.end();
});

test('pickOneSpace', (t) => {
  const game = new Game();
  game.spaces = Immutable.Range(0, 10).toSet();
  t.ok(
    Immutable.is(game.pickOneSpace(0), game.pickOneSpace(0)),
    'same seed should return same element'
  );
  t.notOk(
    Immutable.is(game.pickOneSpace(0), game.pickOneSpace(1)),
    'differnt "i % length" should return different element'
  );

  const all = Immutable
  .Range(0, game.spaces.size)
  .map((i) => game.pickOneSpace(i))
  .toSet();
  t.ok(
    Immutable.is(all, game.spaces),
    'should be able to get all elements'
  );

  game.spaces = Immutable.Set();
  t.equal(game.pickOneSpace(0), null, 'should return null if no space');

  t.end();
});

test('putFood', (t) => {
  const game = new Game();
  game.spaces = Immutable.Range(0, 10).toSet();
  game.putFood(0);
  t.notEqual(game.food, null, 'should has food');
  t.equal(game.spaces.size, 9, 'should reduce one space');
  t.notOk(game.spaces.has(game.food), 'spaces should not contains food');
  t.end();
});

test('init', (t) => {
  t.throws(() => {
    const game = new Game();
    game.init();
  }, /seed/, 'should throw if seed not given');

  const game = new Game();
  game.init(0);

  t.ok(Immutable.Set.isSet(game.spaces), 'spaces should be an Imu Set');
  t.ok(Immutable.List.isList(game.snake), 'snake should be an Imu List');
  t.ok(game.food instanceof Grid, 'food should be a Grid');
  t.ok(
    game.spaces.reduce((reducer, val) => reducer && (val instanceof Grid)),
    'all spaces are grids'
  );
  t.ok(
    game.snake.reduce((reducer, val) => reducer && (val instanceof Grid)),
    'all snake elements are grids'
  );
  t.equal(
    game.spaces.size + game.snake.size + 1,
    game.width * game.height,
    'should be exactly w * h grids'
  );

  t.equal(game.status, 'inited');

  t.end();
});

test('setDirection', (t) => {
  const game = new Game();
  game.init(0);

  game.direction = 'up';
  game.setDirection('up');
  t.equal(game.direction, 'up', 'should still be up if up to up');

  game.direction = 'up';
  game.setDirection('right');
  t.equal(game.direction, 'right', 'should change direction if up to right');

  game.direction = 'up';
  game.setDirection('down');
  t.equal(game.direction, 'up', 'should not change direction if up to down');

  game.direction = 'up';
  game.setDirection('left');
  t.equal(game.direction, 'left', 'should change direction if up to left');

  game.direction = 'right';
  game.setDirection('up');
  t.equal(game.direction, 'up', 'should change direction if right to up');

  game.direction = 'right';
  game.setDirection('right');
  t.equal(game.direction, 'right', 'should still be right if right to right');

  game.direction = 'right';
  game.setDirection('down');
  t.equal(game.direction, 'down', 'should change direction if right to down');

  game.direction = 'right';
  game.setDirection('left');
  t.equal(game.direction, 'right', 'should not change direction if right to left');

  t.end();
});

test('nextGrid', (t) => {
  const game = new Game();
  game.init(0);

  const x = 0;
  const y = 1;
  game.snake = Immutable.List.of(
    new Grid(),
    new Grid({ x, y })
  );

  game.direction = 'left';
  t.ok(
    Immutable.is(game.nextGrid, new Grid({ x: x - 1, y })),
    'should go left'
  );

  game.direction = 'right';
  t.ok(
    Immutable.is(game.nextGrid, new Grid({ x: x + 1, y })),
    'should go right'
  );

  game.direction = 'up';
  t.ok(
    Immutable.is(game.nextGrid, new Grid({ x: x, y: y - 1 })),
    'should go up'
  );

  game.direction = 'down';
  t.ok(
    Immutable.is(game.nextGrid, new Grid({ x: x, y: y + 1 })),
    'should go down'
  );

  t.end();
});

test('isInside', (t) => {
  const game = new Game({
    width: 5,
    height: 5,
  });

  t.ok(game.isInside(new Grid({
    x: 2,
    y: 2,
  })), '( 2, 2 ) should be inside 5 x 5');
  t.ok(game.isInside(new Grid({
    x: 0,
    y: 0,
  })), '( 0, 0 ) should be inside 5 x 5');
  t.notOk(game.isInside(new Grid({
    x: 5,
    y: 5,
  })), '( 5, 5 ) should not be inside 5 x 5');
  t.notOk(game.isInside(new Grid({
    x: -1,
    y: 3,
  })), '( -1, 3 ) should not be inside 5 x 5');
  t.notOk(game.isInside(new Grid({
    x: 1,
    y: -3,
  })), '( 1, -3 ) should not be inside 5 x 5');

  t.end();
});

test('checkResult', (t) => {
  const game = new Game();
  game.init(0);

  t.equal(game.checkResult(game.food), 'food', 'should recognize food');
  t.equal(
    game.checkResult(new Grid({ x: -5, y: 0})),
    'dead',
    'should gameover when out of bound'
  );
  t.equal(
    game.checkResult(game.snake.first()),
    'dead',
    'should gameover when step on snake'
  );
  t.equal(
    game.checkResult(game.spaces.first()),
    'empty',
    'should be good when step on empty spaces'
  );

  game.spaces = Immutable.Set();
  game.food = null;
  t.equal(game.checkResult(new Grid()), 'dead', 'should be dead if no place to go');

  t.end();
});

test('move', (t) => {
  t.test('valid movement', (st) => {
    const desiredHead = {
      left: ({x, y}) => ({ x: x + 1, y }), // cuz now direction is 'right'
      right: ({x, y}) => ({ x: x + 1, y }),
      up: ({x, y}) => ({ x, y: y - 1 }),
      down: ({x, y}) => ({ x, y: y + 1}),
    };

    function setup () {
      const game = new Game();
      game.init(0);

      // make sure food is unreachable
      game.spaces = game.spaces.add(game.food);
      game.food = new Grid({
        x: 0,
        y: 0,
      });
      game.spaces = game.spaces.delete(game.food);
      return game;
    }

    function runTest (direction) {
      const game = setup();
      const headBefore = game.snake.last();

      game.move({
        direction,
        seed: 0,
      });
      const headAfter = game.snake.last();

      st.equal(game.status, 'playing', `should be alive after moved ${direction}`);
      st.ok(Immutable.is(
        headAfter,
        new Grid(desiredHead[direction]({
          x: headBefore.get('x'),
          y: headBefore.get('y'),
        }))
      ), 'head should be moved to desired position');
    }

    ['left', 'right', 'up', 'down'].forEach(runTest);

    st.end();
  });

  t.test('eat food', (st) => {
    const game = new Game();
    game.init(0);
    const headBefore = game.snake.last();
    const snakeLenBefore = game.snake.size;
    const spacesLenBefore = game.spaces.size;
    const scoreBefore = game.score;

    // put food in front of snake
    game.spaces.add(game.food);
    game.food = new Grid({
      x: headBefore.get('x') + 1,
      y: headBefore.get('y'),
    });
    game.spaces.delete(game.food);

    const foodBefore = game.food;

    game.move({
      direction: 'right',
      seed: 0,
    });

    const headAfter = game.snake.last();
    st.equal(game.status, 'playing', 'should be alive after move rightward');
    st.equal(game.snake.size, snakeLenBefore + 1, 'snake should be one grid longer');
    st.ok(Immutable.is(foodBefore, headAfter), 'snake head should be where food was');
    st.equal(spacesLenBefore - 1, game.spaces.size, 'spaces should be one grid smaller');
    st.ok(game.food !== null, 'shuld have new food');
    st.equal(game.score, scoreBefore + game.scoreStep, 'should earn some score');

    st.end();
  });

  t.test('touch boundary', (st) => {
    function setup () {
      // a game that any move will lead to death
      const game = new Game({
        width: 5,
        initialSnake: 5,
        height: 1,
      });
      game.init(0);
      return game;
    }

    ['right', 'up', 'down'].forEach((direction) => {
      const game = setup();
      const scoreBefore = game.score;
      game.move({
        direction,
        seed: 0
      });
      st.equal(
        game.status,
        'ended',
        `should gameover if touch the ${direction} boundary`
      );
      st.equal(scoreBefore, game.score, 'should not earn score');
    });

    const game = new Game({
      width: 1,
      height: 1,
      initialSnake: 1,
      direction: 'left',
    });
    game.init(0);
    const scoreBefore = game.score;
    game.move({
      direction: 'left',
      seed: 0
    });
    st.equal(game.status, 'ended', 'should gameover if touch the left boundary');
    st.equal(game.score, scoreBefore, 'should not earn score');

    st.end();
  });

  t.test('touch itself', (st) => {
    function setup () {
      const game = new Game();
      game.init(0);

      // generate a "no way to go" snake
      game.snake = Immutable.List.of([
        [0, 0], [0, 1], [0, 2], [1, 2], [2, 2], [2, 1], [2, 0], [1, 0], [1, 1]
      ].map(([x, y]) => new Grid({ x, y })));
      return game;
    }

    ['right', 'up', 'down'].forEach((direction) => {
      const game = setup();
      const scoreBefore = game.score;
      game.move({
        direction,
        seed: 0
      });
      st.equal(game.status, 'ended', 'should gameover when touch itself');
      st.equal(scoreBefore, game.score, 'should not earn score');
    });

    const game = setup();
    const scoreBefore = game.score;
    game.direction = 'up';
    game.move({
      direction: 'left',
      seed: 0
    });
    st.equal(game.status, 'ended', 'should gameover when touch itself');
    st.equal(game.score, scoreBefore, 'should not earn score');

    st.end();
  });

  t.test('win', (st) => {
    const game = new Game({
      width: 5,
      height: 1,
      initialSnake: 4,
    });
    game.init(0);
    const scoreBefore = game.score;

    game.move({
      direction: 'right',
      seed: 0
    });
    st.equal(game.food, null, 'food should be null');
    st.equal(game.status, 'win', 'should win if all spaces are occupied');
    st.equal(game.score, scoreBefore + game.scoreStep, 'should earn score');

    st.end();
  });

  t.end();
});
