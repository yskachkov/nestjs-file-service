import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'User name field value'
  })
  @IsString()
  username: string;

  @ApiProperty({
    description: 'User password field value'
  })
  @IsString()
  password: string;
}

export interface AuthData {
  access_token: string;
}
