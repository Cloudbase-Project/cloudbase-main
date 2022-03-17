import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable, throwError } from 'rxjs';
import { ApplicationException } from './ApplicationException';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(
    exception: unknown,
    host: ArgumentsHost,
  ): Response<any, Record<string, any>> | Observable<any> {
    console.log(exception);

    if (host.getType() === 'http') {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request = ctx.getRequest<Request>();

      const status =
        exception instanceof ApplicationException
          ? exception.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;

      return response.status(status).json({
        statusCode: status,
        message: 'Internal Server Error',
        timestamp: new Date().toISOString(),
      });
    } else if (host.getType() === 'rpc') {
      return new Observable((subscriber) => {
        subscriber.error('Internal Server Error ');
      });
    }
  }
}
