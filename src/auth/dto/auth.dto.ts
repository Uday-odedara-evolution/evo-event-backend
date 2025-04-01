import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class SignInDto {
  @ApiProperty({
    example: 'test@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '123',
  })
  @IsString()
  password: string;
}
