import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from './dto/user.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { User } from '@prisma/client';

interface CreatedUserResult {
  id: number;
  email: string;
  username: string;
}

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Get()
  @ApiResponse({
    status: 200,
    description: 'List of all users',
    example: {
      data: [
        {
          id: 1,
          username: 'admin',
          email: 'a@b.com',
          password: '123',
        },
        {
          id: 2,
          username: 'user',
          email: 'a@b.com',
          password: '123',
        },
      ],
    },
  })
  getAllUsers(): Promise<User[]> {
    return this.userService.getAllUser();
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
  @Post()
  addUser(@Body() userData: CreateUserDTO): Promise<CreatedUserResult> {
    try {
      const user = this.userService.addUser(
        userData.email,
        userData.password,
        userData.username,
      );

      return user;
    } catch (error: unknown) {
      if (error instanceof HttpException) {
        throw new HttpException(error, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('unknown error', HttpStatus.BAD_REQUEST);
    }
  }
}
