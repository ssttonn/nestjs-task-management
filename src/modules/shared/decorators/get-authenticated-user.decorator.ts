import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const GetAuthenticatedUser = createParamDecorator(
  (key: string | undefined, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest();
    if (key) {
      return request.scope.currentUser?.[key];
    }

    return request.scope.currentUser ?? null;
  },
);
