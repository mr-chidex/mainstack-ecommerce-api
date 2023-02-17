import { format, transports } from 'winston';
import { Request, Response, NextFunction } from 'express';

import config from '../config';
import { logger } from './logger.handler';
import { Err } from './handler.interface';

export class ErrorHandler {
  static async error(err: Err, _req: Request, res: Response, _next: NextFunction) {
    logger.log({
      level: 'info',
      message: err.message,
    });
    logger.log({
      level: 'error',
      message: err.message,
    });

    const code = err.statusCode || Number(err?.code) || 500;

    if (config.NODE_ENV !== 'production') {
      logger.add(
        new transports.Console({
          format: format.simple(),
        }),
      );

      return res.status(code).json({ message: err.message, error: true, stack: err.stack, code });
    }

    res.status(code).json({ message: err.message, error: true, code });
  }
}
