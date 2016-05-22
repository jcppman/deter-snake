import getTime from 'right-now';
import events from 'events';

const CHECK_INTERVAL = 100;

export class Driver extends events.EventEmitter {
  constructor(interval = 1000) {
    super();
    this.lastTime = getTime();
    this.direction = 'right';
    this.interval = interval;
    this.timer = null;
    this.updateSeed();
  }
  start() {
    if (this.timer) {
      return;
    }
    this.timer = setTimeout(
      () => {
        if (getTime() - this.lastTime > this.interval) {
          this.lastTime = getTime();
          this.tick();
        }
        this.timer = null;
        this.start();
      },
      CHECK_INTERVAL
    );
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
  }
  tick() {
    this.emit('tick', {
      seed: this.seed,
      direction: this.direction,
    });
  }
}
