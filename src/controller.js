import { Logger } from './logger';
import { Joystick } from './joystick';
import { Game } from './core';
import { Display, Sound } from './views';
import { Driver } from './driver';

const logger = new Logger('Controller');

export class Controller {
  constructor(
    game = new Game(),
    driver = new Driver(),
    joystick = new Joystick(),
    views = [new Display(game.width / game.height), new Sound()]
  ) {
    this.game = game;
    this.driver = driver;
    this.joystick = joystick;
    this.views = views;
  }
  start() {
    this.joystick.start();
    this.joystick.on('operation', (op) => {
      if (!this.driver.isRunning) {
        logger.info('start driver');
        this.driver.start();
      }
      if (op === 'restart') {
        this.game.restart();
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
    logger.debug('game status:', this.game.status);
    if (this.game.status === 'ended' || this.game.status === 'win') {
      this.driver.pause();
    }
    this.render();
  }
  render() {
    this.views.forEach((v) => {
      v.render(this.game);
    });
  }
}
