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

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getAllUsers(): any {
    return this.userService.getAllUser();
  }

  @Post()
  addUser(@Body() userData: CreateUserDTO): any {
    try {
      return this.userService.addUser(
        userData.email,
        userData.password,
        userData.username,
      );
    } catch (error: any) {
      console.log('error', error);
      throw new HttpException(error.toString(), HttpStatus.BAD_REQUEST);
    }
  }
}
