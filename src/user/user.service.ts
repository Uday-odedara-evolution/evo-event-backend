import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User as UserModel } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';

interface CreatedUserResult {
  id: number;
  email: string;
  username: string;
}

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly redisService: RedisService,
  ) {}
  async getAllUser(): Promise<UserModel[]> {
    const cachedUser = await this.redisService.get('users', 'all');
    if (cachedUser) {
      return JSON.parse(cachedUser) as UserModel[];
    }
    const users = await this.prismaService.user.findMany();

    await this.redisService.set('users', 'all', JSON.stringify(users));

    return users;
  }

  async addUser(
    email: string,
    password: string,
    username: string,
  ): Promise<CreatedUserResult> {
    try {
      const user = await this.prismaService.user.create({
        data: {
          email,
          password,
          username,
        },
      });

      const result = {
        id: user.id,
        username: user.username,
        email: user.email,
      };

      return result;
    } catch (error: unknown) {
      if (error instanceof HttpException) {
        throw new BadRequestException();
      }
      throw new HttpException('unknown error', HttpStatus.BAD_REQUEST);
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

      return user;
    } catch (error: unknown) {
      if (error instanceof HttpException) {
        throw new NotFoundException();
      }
      throw new HttpException('unknown error', HttpStatus.BAD_REQUEST);
    }
  }
}
