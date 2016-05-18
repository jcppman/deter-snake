import winston from 'winston';
import Immutable from 'immutable';

const list = Immutable.List.of(1, 2, 3);
winston.log(list);
