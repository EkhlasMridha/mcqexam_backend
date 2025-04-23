import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import type { AccessTokenPayload } from '../types';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as AccessTokenPayload;
  },
);
