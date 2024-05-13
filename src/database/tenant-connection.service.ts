// tenant-connection.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { AdminDatabaseConfigService } from './admin-database-config.service';
import { Organization } from '../admin/entities/organization.admin.entity';
import { TenantDatabaseConfigService } from './tenant-database-config.service';

@Injectable()
export class TenantConnectionService {
  private connectionMap: Map<string, DataSource> = new Map();
  private logger = new Logger(this.constructor.name);
  private organizationRepository: Repository<Organization>;

  constructor(
    // private configService: ConfigService,
    private adminDatabaseConfigService: AdminDatabaseConfigService,
    private tenantDatabaseConfigService: TenantDatabaseConfigService,
  ) {}

  async onModuleInit() {
    this.logger.log('module init');
    await this.initOrganizationRepository();
    await this.generateConnections();
  }

  async initOrganizationRepository() {
    let adminDataSource = new DataSource(
      this.adminDatabaseConfigService.createTypeOrmOptions(),
    );
    adminDataSource = await adminDataSource.initialize();
    this.organizationRepository = adminDataSource.getRepository(Organization);
  }

  async getTenants() {
    return this.organizationRepository.find({
      select: ['databaseName', 'label'],
    });
  }

  public async generateConnections() {
    const tenants = await this.getTenants();
    for (const tenant of tenants) {
      const newDataSource = await this.initializeTenantDataSource(
        tenant.databaseName,
      );
      await this.addTenantToConnectionMap(tenant.label, newDataSource);
    }
  }

  public async getTenantConnection(label: string): Promise<DataSource> {
    // First, check if the connection for the tenant already exists.
    let dataSource = this.connectionMap.get(label);
    if (dataSource) {
      return dataSource;
    }

    // If the connection does not exist, retrieve the organization info.
    const organization = await this.organizationRepository.findOne({
      where: { label: label },
      select: ['databaseName'],
    });

    // If the organization is not found or doesn't have a databaseName, throw an error.
    if (!organization || !organization.databaseName) {
      throw new Error(
        `Organization with label ${label} not found or missing database name.`,
      );
    }

    // Initialize a new DataSource for the tenant's database.
    dataSource = new DataSource(
      this.tenantDatabaseConfigService.createTypeOrmOptions(
        organization.databaseName,
      ),
    );
    await dataSource.initialize();

    // Optionally, you can run migrations here if needed.
    // await dataSource.runMigrations();

    // Store the new DataSource in the connection map.
    await this.addTenantToConnectionMap(label, dataSource);

    return dataSource;
  }

  public async initializeTenantDataSource(
    databaseName: string,
  ): Promise<DataSource> {
    let newDataSource = new DataSource(
      this.tenantDatabaseConfigService.createTypeOrmOptions(databaseName),
    );
    newDataSource = await newDataSource.initialize();
    await newDataSource.runMigrations({ transaction: 'all', fake: false });
    // await newDataSource.undoLastMigration();
    await this.addTenantToConnectionMap(databaseName, newDataSource);
    return newDataSource;
  }

  async addTenantToConnectionMap(customerId: string, dataSource: DataSource) {
    this.connectionMap.set(customerId, dataSource);
  }
}
