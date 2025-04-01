import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';

@Module({
  imports: [],
  providers: [UserService, PrismaService, RedisService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
