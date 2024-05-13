import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsAlphanumeric, IsLowercase } from 'class-validator';
import { User } from '../../user/entities/user.admin.entity';

@Entity()
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ unique: true })
  @ApiProperty()
  @IsLowercase()
  @IsAlphanumeric('en-US')
  // The same as subdomain of an organization
  label: string;

  @Column({ unique: true })
  @ApiProperty()
  name: string;

  @Column({ unique: true })
  databaseName: string;

  @Column({ unique: true })
  auth0OrganizationId: string;

  @ManyToMany(() => User, (user) => user.organizations)
  users: User[];
}
