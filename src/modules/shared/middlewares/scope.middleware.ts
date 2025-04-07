import { NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { Scope } from '../dtos/scope.dto';
import { ContextIdFactory } from '@nestjs/core';
import { appStorage } from '../storages/app.storage';

export class ScopeMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: (error?: any) => void) {
    const scope = new Scope({
      accessToken: req.header('access_token'),
      refreshToken: req.header['refresh_token'],
    });

    if (!scope.accessToken)
      scope.accessToken = req.header('Authorization')?.split(' ').pop();

    req.scope = scope;
    const ctxId = ContextIdFactory.getByRequest(req);

    appStorage.run({ ctxId, request: req }, () => {
      next();
    });
  }
}
