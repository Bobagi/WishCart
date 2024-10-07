import { createLogger, format, transports } from 'winston';

const logger = createLogger({
  level: 'info', // e.g. 'info', 'error', 'debug'
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  transports: [
    new transports.Console({ format: format.combine(format.colorize(),         
      format.printf(({ timestamp, message }) => {
        return `${timestamp}: ${message}`;
      })) }),
    new transports.File({ filename: 'app.log' })
  ]
});

export default logger;
