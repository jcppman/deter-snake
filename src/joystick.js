import { Logger } from './logger';
import events from 'events';
import { joystickDefaults } from './defaults';

const logger = new Logger('joystick');

export class Joystick extends events.EventEmitter {
  constructor(_config) {
    super();

    this.mapping = Object.assign({}, joystickDefaults, _config);
    window.addEventListener('keydown', (e) => {
      const keyCode = e.keyCode;
      if (this.mapping[keyCode] !== undefined) {
        logger.debug('valid keystrike', this.mapping[keyCode]);
        this.emit('operation', this.mapping[keyCode]);
      }
    });
    window.addEventListener('touchstart', (e) => {
      const target = e.targetTouches[0];
      let operation;
      if (target) {
        const { clientX, clientY } = target;
        const width = document.body.clientWidth;
        const height = document.body.clientHeight;
        if (clientX > width / 3 && clientX < width / 3 * 2) {
          // touch the middle vertical area
          if (clientY < height / 3) {
            operation = 'up';
          } else if (clientY > height / 3 * 2) {
            operation = 'down';
          } else {
            operation = 'restart';
          }
        } else {
          // left or right
          operation = (clientX <= width / 3) ? 'left' : 'right';
        }
        this.emit('operation', operation);
      }
    });
  }
}
