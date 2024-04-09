import {
  MiddlewareConsumer,
  Module,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TagModule } from './tag/tag.module';
import { AdminModule } from './admin/admin.module';
import { Auth0Module } from './auth0/auth0.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { TenantIdentificationMiddleware } from './middlewares/tenant-identification.middleware';
import { UserModule } from './user/user.module';
import { TenantConnectionService } from './database/tenant-connection.service';
import { CourseModule } from './course/course.module';
import { LessonModule } from './lesson/lesson.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    TagModule,
    AdminModule,
    Auth0Module,
    UserModule,
    CourseModule,
    LessonModule,
  ],
  controllers: [AppController],
  providers: [AppService, TenantIdentificationMiddleware],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(
    private readonly tenantConnectionService: TenantConnectionService,
  ) {}

  async onApplicationBootstrap() {
    await this.tenantConnectionService.generateConnections();
  }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantIdentificationMiddleware).forRoutes('*');
  }
}
