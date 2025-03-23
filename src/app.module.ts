import { Module, ValidationPipe } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [TasksModule],
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
  ],
})
export class AppModule {}
