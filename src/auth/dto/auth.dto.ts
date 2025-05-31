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

export const forgotPasswordSchema = z
  .object({
    email: z.string().email({ message: 'Enter a valid email' }),
  })
  .required();

export const resetPasswordSchema = z
  .object({
    token: z.string({ message: 'Token is required to reset password' }),
    password: z.string({ message: 'Password is required' }),
  })
  .required();

export type VerifyTokenDto = z.infer<typeof verifyTokenSchema>;
export type ForgotPasswordDto = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordDto = z.infer<typeof resetPasswordSchema>;
