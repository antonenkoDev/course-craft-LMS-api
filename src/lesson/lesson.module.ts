import { Module } from '@nestjs/common';
import { LessonController } from './lesson.controller';
import { LessonService } from './lesson.service';
import { TenantProvider } from 'src/database/providers/tenant.provider';
import { Auth0Service } from 'src/auth0/auth0.service';

@Module({
  controllers: [LessonController],
  providers: [LessonService, TenantProvider, Auth0Service]
})
export class LessonModule {}
