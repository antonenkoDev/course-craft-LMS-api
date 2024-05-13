import { Inject, Injectable, Logger, Scope } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from './entities/user.admin.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { Auth0Service } from '../auth0/auth0.service';
import { REQUEST } from '@nestjs/core';
import { TENANT_DATASOURCE } from '../database/providers/tenant.provider';
import { HsRequest } from '../interfaces/hs-request.interface';
import { ConfigService } from '@nestjs/config';
import { ADMIN_DATA_SOURCE } from '../admin/providers/database.providers';
import { Organization } from '../admin/entities/organization.admin.entity';

@Injectable({ scope: Scope.REQUEST })
export class UserService {
  private readonly userRepository: Repository<User>;
  private readonly organizationRepository: Repository<Organization>;
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    @Inject(ADMIN_DATA_SOURCE)
    private dataSource: DataSource,
    private auth0Service: Auth0Service,
    @Inject(REQUEST) private request: HsRequest,
    private configService: ConfigService,
  ) {
    this.logger.log('USER SERVICE initialized');
    this.userRepository = dataSource.getRepository(User);
    this.organizationRepository = dataSource.getRepository(Organization);
  }

  async findAll(options?: { isActive: boolean }) {
    return await this.userRepository.find({
      where: { isActive: options?.isActive ?? true },
    });
  }

  async create(
    createUserDto: CreateUserDto,
    options?: { connectionName?: string; auth0OrganizationId?: string },
  ) {
    const auth0UserId = await this.auth0Service.createOrGetUser({
      email: createUserDto.email,
      password: createUserDto.password,
      connection:
        options?.connectionName ??
        this.configService.get<string>('AUTH0_CONNECTION_NAME'),
      // phone_number: createUserDto.phone,
    });
    const newUser: User = this.userRepository.create(createUserDto);
    newUser.isActive = true;
    return this.userRepository.save(newUser);
  }

  async createUserInOrganization(
    createUserDto: CreateUserDto,
    options?: { connectionName?: string; organizationId?: string },
  ) {
    const user = await this.create(createUserDto, options);
    const organization = await this.organizationRepository.findOneBy({
      uuid: options?.organizationId,
    });

    await this.addUserToAuth0Organization(
      user.uuid,
      organization.auth0OrganizationId,
    );
    user.organizations.push(organization);
    return await this.userRepository.save(user);
  }

  async addUserToAuth0Organization(
    auth0UserId: string,
    auth0OrganizationId: string,
  ) {
    return await this.auth0Service.addUserToOrganization(
      auth0UserId,
      auth0OrganizationId,
    );
  }

  async findById(uuid: string) {
    return this.userRepository.findOneBy({ uuid });
  }

  async activate(uuid: string) {
    await this.userRepository
      .createQueryBuilder()
      .update()
      .set({ isActive: true })
      .where('uuid = :uuid', { uuid })
      .execute();
    return true;
  }

  async deactivate(uuid: string) {
    await this.userRepository
      .createQueryBuilder()
      .update()
      .set({ isActive: false })
      .where('uuid = :uuid', { uuid })
      .execute();
    return true;
  }

  async delete(uuid: string) {
    await this.userRepository.delete(uuid);
    return true;
  }
}
