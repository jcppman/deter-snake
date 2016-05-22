import Immutable from 'immutable';
import { gameDefaults } from './defaults';

export const Grid = Immutable.Record({
  x: 0,
  y: 0,
});

export class Game {
  constructor(_config) {
    const config = Object.assign({}, gameDefaults, _config);

    if (config.width < config.initialSnake) {
      throw new Error('width should not be smaller than initialSnake');
    }
    if (config.height < 1) {
      throw new Error('height should not be smaller than 1');
    }
    this.width = config.width;
    this.height = config.height;
    this.initialSnake = config.initialSnake;
    this.scoreStep = config.scoreStep;
    this.direction = config.direction;
    this.snake = Immutable.List();
    this.spaces = Immutable.Set();
    this.food = null;
    this.score = 0;
    this.status = 'new';
  }
  init(seed) {
    if (seed === undefined) {
      throw new Error('seed not given');
    }

    const snakeHeight = Math.floor(this.height / 2);
    this.snake = Immutable
    .Range(0, this.initialSnake)
    .map((x) => new Grid({ x, y: snakeHeight })).toList();

    this.spaces = Immutable
    .Range(0, this.height)
    .map((y) =>
      Immutable
      .Range(0, this.width)
      .map((x) => new Grid({ x, y }))
    ).flatten(1)
    .toSet()
    .subtract(this.snake);

    this.putFood(seed);

    this.status = 'inited';
  }
  putFood(seed) {
    this.food = this.pickOneSpace(seed);
    this.spaces = this.spaces.subtract([this.food]);
  }
  pickOneSpace(seed) {
    const picked = this.spaces
    .valueSeq()
    .skip(seed % this.spaces.size)
    .first();
    return (picked === undefined) ? null : picked;
  }
  move(operation) {
    if (this.status === 'ended' || this.status === 'win') {
      return;
    }

    this.status = 'playing';

    const { direction, seed } = operation;

    if (seed === undefined) {
      throw new Error('not seed givin');
    }

    this.setDirection(direction);

    const target = this.nextGrid;
    const moveResult = this.checkResult(target);
    const tail = this.snake.first();

    switch (moveResult) {
      default:
      case 'dead':
        this.status = 'ended';
        break;
      case 'food':
        this.score += this.scoreStep;
        this.snake = this.snake.push(target);
        this.putFood(seed);
        this.spaces = this.spaces.delete(this.food);
        if (this.food === null) {
          // no space available, win!
          this.status = 'win';
        }
        break;
      case 'empty':
        this.snake = this.snake.shift().push(target);
        this.spaces.add(tail);
        break;
    }
  }
  checkResult(target) {
    if (Immutable.is(target, this.food)) {
      return 'food';
    } else if (this.spaces.has(target) && this.isInside(target)) {
      return 'empty';
    }
    return 'dead';
  }
  isInside(target) {
    const x = target.get('x');
    const y = target.get('y');
    return (x >= 0) && (x < this.width) && (y >= 0) && (y < this.height);
  }
  get nextGrid() {
    const direction = this.direction;
    const head = this.snake.last();

    let next;
    switch (direction) {
      default:
      case 'left':
        next = new Grid({ x: head.x - 1, y: head.y });
        break;
      case 'right':
        next = new Grid({ x: head.x + 1, y: head.y });
        break;
      case 'up':
        next = new Grid({ x: head.x, y: head.y - 1 });
        break;
      case 'down':
        next = new Grid({ x: head.x, y: head.y + 1 });
        break;
    }
    return next;
  }
  setDirection(sInst) {
    const instruction = Game.direction[sInst];
    const direction = Game.direction[this.direction];

    // only change direction if the instruction is not opposite
    if ((direction + instruction) % 2 !== 0) {
      this.direction = sInst;
    }
  }
}

Game.direction = {
  up: 0,
  right: 1,
  down: 2,
  left: 3,
};
