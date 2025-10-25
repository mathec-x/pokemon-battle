
import { LoggerService } from '@/application/services/logger/LoggerService';
import { NextFunction, Request, Response, Router } from 'express';
import { HttpError } from '../errors/handler';

export class ExpressRouteHandler {
  private readonly logger = new LoggerService(ExpressRouteHandler.name);

  register(fn: Router) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        return await fn(req, res, next);
      } catch (err: Error | any) {
        this.logger.critical(`Route '${req.url}' responds with error ${err?.message}`);
        return new HttpError().handle(req, res, err);
      } finally {
        this.logger.debug(`Route '${req.url}' responds with code: ${res.statusCode}`);
      }
    };
  }
}