import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User as UserModel } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly redisService: RedisService,
  ) {}
  async getAllUser(): Promise<UserModel[]> {
    const cachedUser = await this.redisService.get('users', 'all');
    console.log('cachedUser', cachedUser);
    if (cachedUser) {
      return JSON.parse(cachedUser) as UserModel[];
    }
    const users = await this.prismaService.user.findMany();
    console.log('users', users);

    await this.redisService.set('users', 'all', JSON.stringify(users));

    return users;
  }

  async addUser(
    email: string,
    password: string,
    username: string,
  ): Promise<string> {
    try {
      const user = await this.prismaService.user.create({
        data: {
          email,
          password,
          username,
        },
      });
      console.log('user', user);

      return 'User created successfully';
    } catch (error: any) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async findUser(
    email: string,
    pass: string,
  ): Promise<
    | {
        password: string;
        id: number;
        username: string;
        email: string;
      }
    | null
    | undefined
  > {
    try {
      const user = await this.prismaService.user.findUnique({
        where: {
          email,
          password: pass,
        },
      });

      if (!user) {
        throw new NotFoundException();
      }

      if (user.password !== pass) {
        throw new UnauthorizedException();
      }

      // const { password, ...result } = user;
      // TODO: Generate a JWT and return it here
      // instead of the user object
      return user;
    } catch (error) {
      console.log('error', error);
    }
  }
}
