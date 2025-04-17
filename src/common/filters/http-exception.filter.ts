import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { MongooseError } from 'mongoose';
import { ResponseModel } from 'src/common/interceptors/ResponseModel';

@Catch()
export class HttpExceptionFilter<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const MONGO_SERVER_ERROR = 'MongoServerError';

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let details = null;

    const errorInstanceName = (exception as MongooseError).name;

    if (errorInstanceName === MONGO_SERVER_ERROR) {
      const erroObject = exception as any;
      message = erroObject.message;
      status = HttpStatus.BAD_REQUEST;

      details = erroObject.errorResponse;
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();

      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && res !== null) {
        const resObj = res as Record<string, any>;
        message = resObj.message || message;
        details = resObj.message || resObj.error || null;
      }
    }

    response
      .status(status)
      .json(new ResponseModel(details).error({ message, status }));
  }
}
