import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TenantProvider } from '../database/providers/tenant.provider';
import { Auth0Service } from '../auth0/auth0.service';
import { AdminDatabaseProvider } from 'src/admin/providers/database.providers';

@Module({
  imports: [],
  providers: [UserService, TenantProvider, Auth0Service, AdminDatabaseProvider[0]],
  controllers: [UserController],
})
export class UserModule { }
