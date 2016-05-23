export class Logger {
  constructor(name = '', reporters = [console]) {
    this.name = name;
    this.reporters = reporters;
  }
  debug(...contents) {
    contents.unshift(`[${this.name}]`);
    this.reporters.forEach((r) => r.debug.apply(r, contents));
  }
  error(...contents) {
    contents.unshift(`[${this.name}]`);
    this.reporters.forEach((r) => r.error.apply(r, contents));
  }
  info(...contents) {
    contents.unshift(`[${this.name}]`);
    this.reporters.forEach((r) => r.info.apply(r, contents));
  }
}
