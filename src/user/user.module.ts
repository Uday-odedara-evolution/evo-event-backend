import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisModule } from 'src/redis/redis.module';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [RedisModule],
  providers: [UserService, PrismaService, ConfigService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
