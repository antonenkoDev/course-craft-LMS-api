import { ApiProperty, OmitType } from '@nestjs/swagger';
import { User } from '../entities/user.admin.entity';
import { IsNotEmpty } from 'class-validator';

export class CreateUserDto extends OmitType(User, ['uuid', 'auth0Id']) {
  @ApiProperty()
  @IsNotEmpty()
  password: string;
}
