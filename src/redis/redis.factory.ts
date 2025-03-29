import { FactoryProvider, Logger } from '@nestjs/common';
import { Redis } from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { REDIS_CLIENT } from 'constants/constants';

const logger = new Logger('RedisFactory');

export const RedisFactory: FactoryProvider<Redis> = {
  provide: REDIS_CLIENT,
  useFactory: (configService: ConfigService) => {
    const redisInstance = new Redis({
      host: '127.0.0.1',
      port: 6379,
    });

    // Handle Redis error events
    redisInstance.on('error', (e) => {
      logger.error(`Redis connection failed: ${e.message}`);
    });

    // Handle Redis connection events
    redisInstance.on('connect', () => {
      logger.log('Redis connecting...');
    });

    // Handle Redis ready events
    redisInstance.on('ready', () => {
      logger.log('Redis connected and ready!');
    });

    // Handle Redis reconnection events
    redisInstance.on('close', () => {
      logger.warn('Redis disconnected!');
    });

    // Handle Redis connection end events
    redisInstance.on('reconnecting', () => {
      logger.log('Redis reconnecting...');
    });

    // On redis connection ended
    redisInstance.on('end', () => {
      logger.warn('Redis connection ended!');
    });

    return redisInstance;
  },
  inject: [ConfigService],
};
