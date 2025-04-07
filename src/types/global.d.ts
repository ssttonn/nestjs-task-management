import { Scope } from 'src/modules/shared/dtos/scope.dto';

declare global {
  namespace Express {
    export interface Request {
      scope: Scope;
    }
  }
}
