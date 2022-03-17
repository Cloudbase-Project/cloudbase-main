import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { ApplicationException } from './ApplicationException';

@Catch(ApplicationException)
export class ApplicationExceptionFilter implements ExceptionFilter {
  catch(exception: ApplicationException, host: ArgumentsHost) {
    console.log(exception);

    const message = exception.message;

    const payload = {
      errors: [{ message: message }],
      timestamp: new Date().toISOString(),
    };

    if (host.getType() === 'http') {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const status = exception.getStatus();

      return response.status(status).json(payload);
    } else if (host.getType() === 'rpc') {
      return new Observable((subscriber) => {
        subscriber.error(payload);
      });
    }
  }
}
