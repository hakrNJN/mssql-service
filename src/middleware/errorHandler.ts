import { NextFunction, Request, Response } from 'express';

import { HttpException } from '../exceptions/httpException';
import { Logger } from '../utils/logger';

const logger = Logger.getInstance();

export const errorHandler = (
  error: HttpException,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const status = error.status || 500;
  const message = error.message || 'Something went wrong';

  logger.error(`[${req.method}] ${req.path} >> StatusCode: ${status}, Message: ${message}`);

  res.status(status).json({
    status,
    message,
  });
};