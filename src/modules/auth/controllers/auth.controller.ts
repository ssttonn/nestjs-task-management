import { Body, Controller, Post } from '@nestjs/common';
import { AuthSession } from '../dtos/auth-session.dto';
import { LoginPayload } from '../dtos/login-payload.dto';
import { AuthService } from '../services/auth.service';
import { RegisterPayload } from '../dtos/register-payload.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() payload: LoginPayload): Promise<AuthSession> {
    return this.authService.login(payload);
  }

  @Post('register')
  async register(@Body() payload: RegisterPayload): Promise<AuthSession> {
    return this.authService.register(payload);
  }
}
