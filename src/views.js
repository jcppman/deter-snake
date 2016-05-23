import { Logger } from './logger';
import { displayDefaults, soundDefaults } from './defaults';

function noop() {}

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
    window.addEventListener('deviceorientation', () => this.maximize());
  }
  maximize() {
    // same behavior as css background-size: contain
    const { right, left, top, bottom } = this.target.getBoundingClientRect();
    const width = right - left;
    const height = bottom - top;
    const screenWideness = width / height;
    logger.debug(width, height, screenWideness, this.contentWideness);
    let toWidth;
    let toHeight;
    if (screenWideness > this.contentWideness) {
      // height 100%
      logger.debug('make height 100%');
      toWidth = `${height * this.contentWideness}px`;
      toHeight = `${height}px`;
    } else {
      // width 100%
      logger.debug('make width 100%');
      toWidth = `${width}px`;
      toHeight = `${width / this.contentWideness}px`;
    }
    this.canvas.style.width = toWidth;
    this.canvas.style.height = toHeight;
  }
  render(game) {
    const gridSize = this.canvas.height / game.height;

    const drawGrid = (x, y, isSolid) => {
      this.ctx[isSolid ? 'fillRect' : 'strokeRect'](
        x * gridSize,
        y * gridSize,
        gridSize,
        gridSize
      );
    };

    const printText = (content) => {
      const lines = content instanceof Array ? content : [content];

      this.ctx.fillStyle = displayDefaults.palette.normal;
      this.ctx.strokeStyle = displayDefaults.palette.emphase;
      this.ctx.textAlign = 'center';
      this.ctx.font = displayDefaults.font;

      const len = lines.length;
      const offsetX = this.canvas.width / 2;
      const offsetY = (this.canvas.height - displayDefaults.lineHeight * len) / 2;

      lines.forEach((line, i) => {
        this.ctx.fillText(
          line,
          offsetX,
          offsetY + i * displayDefaults.lineHeight
        );
      });
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

    switch (game.status) {
      default:
      case 'new':
      case 'inited':
        printText(displayDefaults.lang.init);
        break;
      case 'playing':
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
        break;
      case 'ended':
        printText([`Score: ${game.score}`].concat(displayDefaults.lang.restart));
        break;
    }
  }
}


export class Sound {
  constructor() {
    if (window.AudioContext) {
      this.ctx = new window.AudioContext();

      this.tickerOsc = this.ctx.createOscillator();
      this.tickerOsc.type = soundDefaults.ticker.type;
      this.tickerOsc.start();

      this.ticker = this.ctx.createGain();
      this.ticker.gain.value = 0;

      this.tickerOsc.connect(this.ticker);
      this.ticker.connect(this.ctx.destination);

      this.eaterOsc = this.ctx.createOscillator();
      this.eaterOsc.type = soundDefaults.eater.type;
      this.eaterOsc.start();

      this.eater = this.ctx.createGain();
      this.eater.gain.value = 0;
      this.eaterOsc.connect(this.eater);
      this.eater.connect(this.ctx.destination);
    } else {
      // not supported, supress it
      this.render = this.tick = this.eat = noop;
    }

    this.lastScore = 0;
    window.asdf = this;
  }
  render(game, driver) {
    logger.debug('play sounds');
    this.tick(driver.direction);
    if (this.lastScore !== game.score) {
      this.lastScore = game.score;
      this.eat(Math.min(game.score * 2 + 200, 1320));
    }
  }
  tick(direction) {
    const volumn = soundDefaults.ticker.volumn;
    const length = soundDefaults.ticker.length;
    const freq = soundDefaults.ticker.frequency[direction];
    this.tickerOsc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    this.ticker.gain.setValueAtTime(volumn, this.ctx.currentTime);
    this.ticker.gain.setValueAtTime(0, this.ctx.currentTime + length);
  }
  eat(freq) {
    const volumn = soundDefaults.eater.volumn;
    const length = soundDefaults.eater.length;
    this.eaterOsc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    this.eater.gain.setValueAtTime(volumn, this.ctx.currentTime);
    this.eater.gain.setValueAtTime(0, this.ctx.currentTime + length);
  }
}
