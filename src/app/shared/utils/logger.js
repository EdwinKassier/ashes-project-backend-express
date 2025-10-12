import winston from 'winston';
import config from '../config/app.config.js';

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const level = () => {
  const env = config.nodeEnv;
  const isDevelopment = env === 'development';
  return isDevelopment ? 'debug' : 'info';
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

winston.addColors(colors);

const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf((info) => {
    const { timestamp, level: lvl, message, ...rest } = info;
    const restString = Object.keys(rest).length ? JSON.stringify(rest, null, 2) : '';
    return `${timestamp} ${lvl}: ${message} ${restString}`;
  })
);

const transports = [
  new winston.transports.Console(),
  new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error',
  }),
  new winston.transports.File({ filename: 'logs/combined.log' }),
];

export const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
  exitOnError: false,
});

// Morgan stream for HTTP logs
export const morganStream = {
  write: (message) => logger.http(message.trim()),
};
