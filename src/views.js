import { Logger } from './logger';
import { displayDefaults } from './defaults';

const logger = new Logger('views');

export class Display {
  constructor(wideness = 1, target = document.body) {
    this.target = target;
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.target.appendChild(this.canvas);
    this.contentWideness = wideness;
    this.snake = null;
    this.food = null;

    // internal coordinates are between ( 0 ~ width, 0 ~ 1000 )
    this.canvas.height = 1000;
    this.canvas.width = 1000 * wideness;

    this.maximize();
    window.addEventListener('resize', () => this.maximize());
  }
  maximize() {
    // same behavior as css background-size: contain
    const { right, left, top, bottom } = this.target.getBoundingClientRect();
    const width = right - left;
    const height = bottom - top;
    const screenWideness = width / height;
    logger.debug(width, height, screenWideness, this.contentWideness);
    let style;
    if (screenWideness > this.contentWideness) {
      // height 100%
      style = `width: ${height * this.contentWideness}px; height: ${height}px;`;
      logger.debug(`make height 100% by "${style}"`);
    } else {
      // width 100%
      style = `width: ${width}px; height: ${width / this.contentWideness}px;`;
      logger.debug(`make width 100% by "${style}"`);
    }
    this.canvas.style = style;
  }
  render(game) {
    const drawGrid = (x, y, isSolid) => {
      const gridSize = this.canvas.height / game.height;
      this.ctx[isSolid ? 'fillRect' : 'strokeRect'](
        x * gridSize,
        y * gridSize,
        gridSize,
        gridSize
      );
    };

    logger.debug('render to canvas');
    const width = this.canvas.width;
    const height = this.canvas.height;

    // clear canvas
    this.ctx.rect(0, 0, width, height);
    this.ctx.fillStyle = displayDefaults.palette.background;
    this.ctx.fill();

    // draw matrix
    this.ctx.fillStyle = displayDefaults.palette.background;
    this.ctx.strokeStyle = displayDefaults.palette.foreground;
    for (let x = 0; x < game.width; x++) {
      for (let y = 0; y < game.height; y++) {
        drawGrid(x, y, false);
      }
    }

    // draw snake
    if (game.snake !== null) {
      this.ctx.fillStyle = displayDefaults.palette.normal;
      this.ctx.strokeStyle = displayDefaults.palette.normal;
      game.snake.forEach((grid) => {
        drawGrid(grid.get('x'), grid.get('y'), true);
      });
    }

    // draw food
    if (game.food !== null) {
      this.ctx.fillStyle = displayDefaults.palette.emphase;
      this.ctx.strokeStyle = displayDefaults.palette.emphase;
      drawGrid(game.food.get('x'), game.food.get('y'), true);
    }
  }
}
export class Sound {
  render() {}
}
