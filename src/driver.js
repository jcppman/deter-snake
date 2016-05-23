import getTime from 'right-now';
import events from 'events';
import { driverDefaults } from './defaults';

const CHECK_INTERVAL = 100;

export class Driver extends events.EventEmitter {
  constructor(_config) {
    super();

    const config = Object.assign({}, driverDefaults, _config);

    this.lastTime = getTime();
    this.direction = config.direction;
    this.interval = config.interval;
    this.status = 'paused';
    this.timer = null;
    this.updateSeed();
  }
  start() {
    if (this.status === 'started') {
      return;
    }

    this.status = 'started';

    const ticker = () => {
      if (this.status === 'paused') {
        return;
      }
      this.timer = setTimeout(
        () => {
          if (getTime() - this.lastTime > this.interval) {
            this.lastTime = getTime();
            this.tick();
          }
          ticker();
        },
        CHECK_INTERVAL
      );
    };

    ticker();
  }
  updateSeed() {
    this.seed = Math.floor(getTime());
  }
  changeDirection(direction) {
    this.updateSeed();
    this.direction = direction;
  }
  pause() {
    clearTimeout(this.timer);
    this.timer = null;
    this.status = 'paused';
  }
  tick() {
    this.emit('tick', {
      seed: this.seed,
      direction: this.direction,
    });
  }
  get isRunning() {
    return this.timer !== null;
  }
}
