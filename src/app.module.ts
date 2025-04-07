import { Module, ValidationPipe } from '@nestjs/common';
import { TasksModule } from './modules/tasks/tasks.module';
import { SharedModule } from './modules/shared/shared.module';
import { AuthModule } from './modules/auth/auth.module';
import { AuthGuard } from './modules/shared/guards/auth.guard';

@Module({
  imports: [TasksModule, SharedModule, AuthModule],
  providers: [
    {
      provide: 'APP_PIPE',
      useFactory: () =>
        new ValidationPipe({
          transform: true,
          whitelist: true,
          validationError: {
            target: false,
            value: false,
          },
          stopAtFirstError: true,
        }),
    },
    {
      provide: 'APP_GUARD',
      useClass: AuthGuard,
    },
  ],
  controllers: [],
})
export class AppModule {}
