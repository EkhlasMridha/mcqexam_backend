import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { RequestContextService } from 'src/request-context.service';
import { PUBLIC_META } from 'src/constants/permissions.constant';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private reqContext: RequestContextService,
  ) {
    super();
  }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride(PUBLIC_META, [
      context.getHandler(),
      context.getClass(),
    ]);

    const handleAuthRoute = () => {
      const result = super.canActivate(context);
      if (typeof result === 'boolean') {
        const req = context.switchToHttp().getRequest();
        this.reqContext.set('user', req.user);
        return result;
      } else if (result instanceof Promise) {
        return result.then((res) => {
          const req = context.switchToHttp().getRequest();
          this.reqContext.set('user', req.user);
          return res;
        });
      }
    };

    return isPublic || handleAuthRoute();
  }
}
