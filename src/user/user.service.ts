import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User as UserModel } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';
import { NewUser } from './user.interface';

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
  ): Promise<NewUser> {
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
        isEmailVerified: user.is_email_verified,
      };

      return result;
    } catch (error: unknown) {
      if (error instanceof HttpException) {
        throw new BadRequestException();
      }
      if (error && typeof error === 'object' && 'message' in error) {
        throw new HttpException(error.message ?? '', HttpStatus.BAD_REQUEST);
      }
      throw new BadRequestException();
    }
  }

  async findUser(email: string, pass: string): Promise<UserModel | null> {
    try {
      const user = await this.prismaService.user.findUnique({
        where: {
          email,
          password: pass,
        },
      });

      return user;
    } catch (error: unknown) {
      if (error instanceof HttpException) {
        throw new NotFoundException();
      }
      throw new HttpException('unknown error', HttpStatus.BAD_REQUEST);
    }
  }

  async findByEmail(email: string): Promise<UserModel | null> {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { email },
      });

      return user;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('Error while finding user by email', error);
      throw new BadRequestException('Error while finding user by email');
    }
  }

  async markEmailAsConfirmed(email: string) {
    const user = await this.prismaService.user.update({
      where: { email },
      data: { is_email_verified: true },
    });

    return user;
  }
}
