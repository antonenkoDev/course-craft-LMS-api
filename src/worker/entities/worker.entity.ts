import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Worker {
  @PrimaryGeneratedColumn()
  uuid: number;

  @Column()
  @ApiProperty()
  //links to Admin Database User
  userId: string;

  @Column()
  @ApiProperty()
  name: string;

  @Column()
  @ApiProperty()
  email: string;

  @Column()
  @ApiProperty()
  role: string; // Role can be 'instructor', 'admin', etc.
}
