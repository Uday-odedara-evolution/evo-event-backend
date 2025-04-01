import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy, OnModuleInit {
  private readonly logger = new Logger(RedisService.name);
  private readonly redis = new Redis({
    host: '127.0.0.1',
    port: 6379,
  });

  constructor() {}

  onModuleInit() {
    this.redis.on('connect', () => {
      console.log('connect');
      this.logger.log('Redis connecting...');
    });

    // Handle Redis ready events
    this.redis.on('ready', () => {
      this.logger.log('Redis connected and ready!');
    });
  }

  onModuleDestroy() {
    this.logger.log('Disconnecting Redis client...');
    this.redis.disconnect();
    this.logger.log('Redis client disconnected.');
  }

  async get(prefix: string, key: string): Promise<string | null> {
    try {
      return this.redis.get(`${prefix}:${key}`);
    } catch (error: unknown) {
      let errMsg = `Error getting key ${prefix}:${key}:`;
      if (error instanceof Error) {
        errMsg += ` ${error?.message}`;
      }
      this.logger.error(errMsg);
      throw error;
    }
  }

  async set(prefix: string, key: string, value: string): Promise<void> {
    try {
      await this.redis.set(`${prefix}:${key}`, value);
    } catch (error: unknown) {
      let errMsg = `Error getting key ${prefix}:${key}:`;
      if (error instanceof Error) {
        errMsg += ` ${error?.message}`;
      }
      this.logger.error(errMsg);
      throw error;
    }
  }

  async delete(prefix: string, key: string): Promise<void> {
    try {
      await this.redis.del(`${prefix}:${key}`);
    } catch (error: unknown) {
      let errMsg = `Error getting key ${prefix}:${key}:`;
      if (error instanceof Error) {
        errMsg += ` ${error?.message}`;
      }
      this.logger.error(errMsg);
      throw error;
    }
  }

  async setWithExpiry(
    prefix: string,
    key: string,
    value: string,
    expiry: number,
  ): Promise<void> {
    try {
      await this.redis.set(`${prefix}:${key}`, value, 'EX', expiry);
    } catch (error: unknown) {
      let errMsg = `Error getting key ${prefix}:${key}:`;
      if (error instanceof Error) {
        errMsg += ` ${error?.message}`;
      }
      this.logger.error(errMsg);
      throw error;
    }
  }
}
