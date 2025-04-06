import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from 'src/modules/auth/controllers/auth.controller';
import { AuthService } from 'src/modules/auth/services/auth.service';
import { SharedModule } from 'src/modules/shared/shared.module';

@Module({
  imports: [
    SharedModule,
    JwtModule.register({
      global: true,
      secret: 'sstonn',
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
