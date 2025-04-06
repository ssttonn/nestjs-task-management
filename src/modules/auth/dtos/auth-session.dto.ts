import { User } from '@prisma/client';

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiryDate: Date;
  refreshTokenExpiryDate: Date;
  userInfo: Omit<User, 'password'>;
}
