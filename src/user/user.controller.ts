import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { Public } from 'src/auth/decorators/public.decorator';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';

@Controller('user')
@ApiTags('User')
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
}
