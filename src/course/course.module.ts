import { Module } from '@nestjs/common';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { TenantProvider } from 'src/database/providers/tenant.provider';
import { Auth0Service } from 'src/auth0/auth0.service';

@Module({
  controllers: [CourseController],
  providers: [CourseService, TenantProvider, Auth0Service],
})
export class CourseModule {}
