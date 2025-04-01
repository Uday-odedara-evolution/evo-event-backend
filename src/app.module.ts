import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { EventModule } from './event/event.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { RedisModule } from './redis/redis.module';
import { LoggerModule } from 'nestjs-pino';
import { LoggerMiddleware } from './middleware/logger.middleware';

@Module({
  imports: [
    AuthModule,
    UserModule,
    EventModule,
    RedisModule,
    ServeStaticModule.forRoot({ rootPath: join(__dirname, '..') }),
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true,
          },
        },
        autoLogging: false,
        quietReqLogger: true,
        quietResLogger: true,
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
