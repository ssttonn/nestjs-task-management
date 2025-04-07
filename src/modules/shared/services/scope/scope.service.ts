import { Injectable } from '@nestjs/common';
import { appStorage } from '../../storages/app.storage';

@Injectable()
export class ScopeService {
  get getRequest() {
    return appStorage?.getStore()?.request;
  }

  get scope() {
    return this.getRequest?.scope;
  }
  get currentUser() {
    return this.scope?.currentUser;
  }
}
