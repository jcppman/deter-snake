import { Logger } from './logger';
import events from 'events';
import { joystickDefaults } from './defaults';

const logger = new Logger('joystick');

const onKeyDown = function onKeyDown(e) {
  const keyCode = e.keyCode;
  if (this.mapping[keyCode] !== undefined) {
    logger.debug('valid keystrike', this.mapping[keyCode]);
    this.emit('operation', this.mapping[keyCode]);
  }
};

export class Joystick extends events.EventEmitter {
  constructor(_config) {
    super();

    this.mapping = Object.assign({}, joystickDefaults, _config);
    this.start();
    this.onKeyDown = null;
  }
  start() {
    if (this.onKeyDown) {
      return;
    }

    this.onKeyDown = onKeyDown.bind(this);
    window.addEventListener('keydown', this.onKeyDown);
  }
  stop() {
    if (!this.onKeyDown) {
      return;
    }
    window.removeEventListener('keydown', this.onKeyDown);
  }
}
