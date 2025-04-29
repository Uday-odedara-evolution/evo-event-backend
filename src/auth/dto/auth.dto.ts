import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';
import { z } from 'zod';

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

export const verifyTokenSchema = z
  .object({
    token: z.string({ message: 'token param is required' }),
  })
  .required();

export type VerifyTokenDto = z.infer<typeof verifyTokenSchema>;
