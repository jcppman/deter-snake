const INITIAL_DIRECTION = 'right';

export const gameDefaults = {
  width: 20,
  height: 15,
  initialSnake: 5,
  scoreStep: 5,
  direction: INITIAL_DIRECTION,
};

export const driverDefaults = {
  interval: 500,
  direction: INITIAL_DIRECTION,
};

export const joystickDefaults = {
  82: 'restart',

  // arrow keys
  38: 'up',
  40: 'down',
  37: 'left',
  39: 'right',

  // jkhl
  74: 'down',
  75: 'up',
  72: 'left',
  76: 'right',
};

export const displayDefaults = {
  palette: {
    background: '#9CBD0F',
    foreground: '#8CAD0F',
    normal: '#306230',
    emphase: '#0F380F',
  },
  font: '80px serif',
  lineHeight: 90,
  lang: {
    init: [
      '[arrow keys] or [jkhl]',
      '  Or touch the screen to control',
    ],
    restart: [
      'To restart',
      '  Press r or touch the center',
    ],
  },
};

export const soundDefaults = {
  ticker: {
    type: 'square',
    frequency: {
      left: 220,
      right: 261.63,
      up: 329.63,
      down: 392.00,
    },
    length: 0.07,
    volumn: 0.1,
  },
  eater: {
    type: 'sine',
    length: 0.2,
    volumn: 0.3,
  },
};
