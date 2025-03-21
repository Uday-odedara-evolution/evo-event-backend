import { IsEmail, IsString } from 'class-validator';

export class CreateUserDTO {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  username: string;
}

export class GetUser {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
