const INITIAL_DIRECTION = 'right';

export const gameDefaults = {
  width: 30,
  height: 20,
  initialSnake: 5,
  scoreStep: 5,
  direction: INITIAL_DIRECTION,
};

export const driverDefaults = {
  interval: 1000,
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
