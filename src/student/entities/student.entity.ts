import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Course } from 'src/course/entities/course.entity';

@Entity()
export class Student {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  @ApiProperty()
  //links to Admin Database User
  userId: string;

  @Column()
  @ApiProperty()
  firstName: string;

  @Column()
  @ApiProperty()
  lastName: string;

  @ManyToMany(() => Course, course => course.students)
  @JoinTable()
  courses: Course[];
}
