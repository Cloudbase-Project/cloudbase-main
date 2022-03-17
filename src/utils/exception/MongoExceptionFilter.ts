import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Error } from 'mongoose';
import { Request, Response } from 'express';
import { MongoError } from 'node_modules/mongodb';
import { Observable, subscribeOn } from 'rxjs';

// @Catch(Error)
// @Catch(mongo.MongoError)
@Catch(MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    console.log(exception);

    const payload = {
      errors: [{ name: exception.name, message: exception.message }],
    };

    if (host.getType() === 'http') {
      const ctx = host.switchToHttp();
      const res = ctx.getResponse<Response>();
      const req = ctx.getRequest<Request>();
      // const status = exception.getStatus();

      return res.status(200).json(payload);
    } else {
      return new Observable((subscriber) => {
        return subscriber.error(payload);
      });
    }
  }
}
