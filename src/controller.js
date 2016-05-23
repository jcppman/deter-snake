import { Logger } from './logger';
import { Joystick } from './joystick';
import { Game } from './core';
import { Display } from './views';
import { Driver } from './driver';
import AnimationFrame from 'animation-frame';
import Immutable from 'immutable';

const logger = new Logger('Controller');
const animationFrame = new AnimationFrame();

export class Controller {
  constructor(
    game = new Game(),
    driver = new Driver(),
    joystick = new Joystick(),
    views = [new Display(game.width / game.height)]
  ) {
    this.game = game;
    this.driver = driver;
    this.joystick = joystick;
    this.views = views;
    this.lastSnake = null;
    this.lastFood = null;
    this.lastStatus = null;
    this.render();
  }
  start() {
    this.joystick.on('operation', (op) => {
      if (!this.driver.isRunning) {
        logger.info('start driver');
        this.driver.start();
      }

      if (op === 'restart') {
        if (this.game.status === 'win' || this.game.status === 'ended') {
          logger.info('restart');
          this.game.reset();
          this.driver.reset();
        }
        return;
      }

      logger.debug('change direction', op);
      this.driver.changeDirection(op);
    });
    this.driver.on('tick', (tick) => {
      logger.debug('one tick', tick);
      this.operate(tick);
    });
  }
  operate(tick) {
    this.game.move(tick);
    this.driver.speedFactor = this.game.score;
    logger.debug('game status:', this.game.status);
    if (this.game.status === 'ended' || this.game.status === 'win') {
      this.driver.pause();
    }
  }
  render() {
    animationFrame.request(() => {
      this.render();
      if (
        Immutable.is(this.lastFood, this.game.food) &&
        Immutable.is(this.lastSnake, this.game.snake) &&
        this.lastStatus === this.game.status
      ) {
        return;
      }
      this.lastFood = this.game.food;
      this.lastSnake = this.game.snake;
      this.lastStatus = this.game.status;
      this.views.forEach((v) => {
        v.render(this.game);
      });
    });
  }
}
