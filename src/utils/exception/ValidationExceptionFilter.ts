import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { ValidationException } from './ValidationException';

@Catch(ValidationException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: ValidationException, host: ArgumentsHost) {
    const errors = exception.serializeError();

    const payload = {
      errors: errors,
      timestamp: new Date().toISOString(),
      message: 'Validation error',
    };

    if (host.getType() === 'http') {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      //   const status = exception.getStatus();

      return response.status(400).json(payload);
    } else if (host.getType() === 'rpc') {
      return new Observable((subscriber) => {
        return subscriber.error(payload);
      });
    }
  }
}
