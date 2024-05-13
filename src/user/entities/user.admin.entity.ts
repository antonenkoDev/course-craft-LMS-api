import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Organization } from '../../admin/entities/organization.admin.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ nullable: true })
  auth0Id: string;

  @Column({ nullable: true })
  isActive: boolean;

  @Column()
  @ApiProperty()
  email: string;

  @ApiProperty()
  @Column()
  firstName: string;

  @ApiProperty()
  @Column({ nullable: true })
  lastName: string;

  @ApiProperty()
  @Column({ nullable: true })
  phone: string;

  @ApiPropertyOptional()
  @Column({ type: 'date', nullable: true })
  birthdate?: string;

  @ApiPropertyOptional()
  @Column({ nullable: true })
  gender: number;

  @ApiPropertyOptional()
  @Column({ nullable: true })
  timezone?: string;

  @ManyToMany(() => Organization, (organization) => organization.users)
  @JoinTable()
  organizations: Organization[];
}
