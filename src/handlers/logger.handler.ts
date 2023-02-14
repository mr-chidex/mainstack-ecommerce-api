import { format, createLogger, transports, Logger } from 'winston';
const { timestamp, label, prettyPrint, combine } = format;

export const logger: Logger = createLogger({
  level: 'info',
  format: combine(label({ label: 'error occurred' }), timestamp(), prettyPrint()),
  defaultMeta: { service: 'user-service' },
  transports: [
    new transports.File({ filename: 'error.log', level: 'error' }),
    new transports.File({ filename: 'combined.log' }),
  ],
});
