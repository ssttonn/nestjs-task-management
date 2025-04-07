import { User } from '@prisma/client';

export class Scope {
  accessToken?: string;
  refreshToken?: string;
  currentUser?: User;

  constructor(data?: Partial<Scope>) {
    Object.assign(this, data);
  }
}
