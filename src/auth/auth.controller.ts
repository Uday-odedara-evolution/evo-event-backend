import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SignInDto, VerifyTokenDto, verifyTokenSchema } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from 'src/email/email.service';
import { ZodValidationPipe } from 'src/utils/zod.validation';
import { CreateUserDTO } from 'src/user/dto/user.dto';
import { UserService } from 'src/user/user.service';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    private readonly userService: UserService,
  ) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiBody({
    type: SignInDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Login response with user details and access token',
    example: {
      access_token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInVzZXJuYW1lIjoidGVzdCIsImVtYWlsIjoidGVzdEBnbWFpbC5jb20iLCJpYXQiOjE3NDMzOTgyNzAsImV4cCI6MTc0MzQ4NDY3MH0.0MbAL9sTUVy6ugnZXFZJapGcYdz2Y35IlpSUBT9AMWw',
      data: {
        userId: 3,
        username: 'test',
        email: 'test@gmail.com',
      },
    },
  })
  async signIn(@Body() signInDto: SignInDto) {
    const user = await this.authService.signIn(
      signInDto.email,
      signInDto.password,
    );

    if (!user.isEmailVerified) {
      throw new BadRequestException('Email is not verified');
    }
    return {
      access_token: await this.jwtService.signAsync(user),
      data: user,
    };
  }

  @Public()
  @Post('send-email')
  @ApiResponse({
    type: 'ss',
  })
  async verifyEmail(@Body() email: string) {
    await this.emailService.sendVerificationLink(email);

    return 'Verification email is sent';
  }

  @Public()
  @ApiBody({
    schema: {
      example: {
        email: 'test3@gmail.com',
        password: '123',
        username: 'test3',
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Response with created User details',
    example: {
      data: [
        {
          id: 5,
          username: 'test3',
          email: 'test3@gmail.com',
        },
      ],
    },
  })
  @Post('register')
  async addUser(@Body() userData: CreateUserDTO) {
    try {
      const user = await this.userService.addUser(
        userData.email,
        userData.password,
        userData.username,
      );

      await this.emailService.sendWelcomeEmail(user);

      return user;
    } catch (error: unknown) {
      if (error instanceof HttpException) {
        throw new HttpException(error, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('unknown error', HttpStatus.BAD_REQUEST);
    }
  }

  @Public()
  @Post('confirm')
  @ApiResponse({
    type: 'string',
  })
  @UsePipes(new ZodValidationPipe(verifyTokenSchema))
  async verifyToken(@Body() confirmationData: VerifyTokenDto) {
    const email = await this.emailService.decodeConfirmationToken(
      confirmationData.token,
    );
    return await this.emailService.verifyEmail(email);
  }
}
