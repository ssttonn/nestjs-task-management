import { IsNotEmpty, IsString } from 'class-validator';
import { LoginPayload } from './login-payload.dto';

export class RegisterPayload extends LoginPayload {
  @IsString()
  @IsNotEmpty()
  username: string;
}
