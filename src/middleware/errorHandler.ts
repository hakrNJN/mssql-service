//src/middleware/errorHandler.ts
import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import winston from 'winston';
import { HttpException } from '../exceptions/httpException';
import { WINSTON_LOGGER } from '../utils/logger';

// Resolve the Winston Logger from the container
// const logger = container.resolve<winston.Logger>(WINSTON_LOGGER);

export const errorHandler = (
  error: HttpException,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const logger = container.resolve<winston.Logger>(WINSTON_LOGGER); 
  
  const status = error.status || 500;
  const message = error.message || 'Something went wrong';

  logger.error(`[${req.method}] ${req.path} >> StatusCode: ${status}, Message: ${message}`);

  res.status(status).json({
    status,
    message,
  });
};