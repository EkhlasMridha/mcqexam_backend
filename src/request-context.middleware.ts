import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { RequestContextService } from './request-context.service';

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  constructor(private requestContext: RequestContextService) {}

  use(req: Request, res: Response, next: NextFunction) {
    this.requestContext.run(() => {
      next();
    });
  }
}
