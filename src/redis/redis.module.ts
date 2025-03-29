import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedisService } from './redis.service';
import { RedisFactory } from './redis.factory';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [RedisService, RedisFactory],
  exports: [RedisService, RedisFactory],
})
export class RedisModule {}
