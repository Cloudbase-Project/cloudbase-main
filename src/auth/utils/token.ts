import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { JWTPayload } from '../types/payload';

@Injectable()
export class JWT {
  public config;
  constructor() {}

  newToken<T extends string | object | Buffer>(
    payload: T,
    jwtConfig = this.config,
  ): string {
    return jwt.sign(payload, process.env.JWT_SECRET, jwtConfig);
  }

  verifyToken<T extends string | object>(
    token: string,
    verifyOptions?: jwt.VerifyOptions,
  ) {
    return jwt.verify(token, process.env.JWT_SECRET, verifyOptions) as T;
  }
}
