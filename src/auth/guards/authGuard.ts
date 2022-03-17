import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JWT } from 'src/auth/utils/token';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private Token: JWT) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();

    const token = req.headers.authorization;

    if (!token) {
      return false;
    }
    try {
      const { email, id } = this.Token.verifyToken(token);

      req.email = email;

      req.id = id;
      return true;
    } catch (err) {
      return false;
    }
  }
}
