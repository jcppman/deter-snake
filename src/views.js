import { Logger } from './logger';

const logger = new Logger('views');

export class Display {
  constructor(wideness = 1, target = document.body) {
    this.target = target;
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.target.appendChild(this.canvas);
    this.contentWideness = wideness;

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
  render() {
    logger.debug();
  }
}
export class Sound {
  render() {}
}
