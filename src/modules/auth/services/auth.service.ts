import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginPayload } from '../dtos/login-payload.dto';
import { AuthSession } from '../dtos/auth-session.dto';
import { PrismaService } from 'src/modules/shared/services/prisma/prisma.service';
import { User } from '@prisma/client';
import { RegisterPayload } from '../dtos/register-payload.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(payload: LoginPayload): Promise<AuthSession> {
    const hashedPassword = await bcrypt.hash(payload.password, 10);

    let existingUser = await this.getExistingUser(payload.email);

    if (!existingUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    let isPasswordMatched = await bcrypt.compare(
      payload.password,
      hashedPassword,
    );

    if (!isPasswordMatched) {
      throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
    }

    const authSession: AuthSession = await this.createAuthSession(existingUser);

    return authSession;
  }

  async register(payload: RegisterPayload): Promise<AuthSession> {
    const { email, password, username } = payload;
    let existingUser = await this.getExistingUser(payload.email);
    if (existingUser) {
      throw new HttpException(
        'Email has already been registered',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let newUser = await this.prismaService.user.create({
      data: {
        name: username,
        email,
        password: hashedPassword,
      },
    });

    return this.createAuthSession(newUser);
  }

  private async getExistingUser(email: string): Promise<User | null> {
    let existingUser = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    return existingUser;
  }

  private async createAuthSession(user: User): Promise<AuthSession> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        {
          expiresIn: '8h',
        },
      ),
      this.jwtService.signAsync(
        {
          id: user.id,
        },
        {
          expiresIn: '30d',
        },
      ),
    ]);

    const { password, ...userInfo } = user;
    const authSession: AuthSession = {
      accessToken,
      refreshToken,
      accessTokenExpiryDate: new Date(Date.now() + 8 * 60 * 60 * 1000),
      refreshTokenExpiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      userInfo,
    };
    return authSession;
  }
}
