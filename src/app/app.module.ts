import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';

import { AuthModule } from '../auth/auth.module';
import { FileModule } from '../file/file.module';
import { HealthModule } from '../health/health.module';

@Module({
  imports: [HealthModule, AuthModule, FileModule],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe
    }
  ]
})
export class AppModule {}
