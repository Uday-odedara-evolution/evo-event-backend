import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { RedisService } from 'src/redis/redis.service';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (_, file, cb) => {
          const filename = `${Date.now().toString()}-${file.originalname.replace(' ', '')}`;
          cb(null, filename);
        },
      }),
    }),
  ],
  controllers: [EventController],
  providers: [EventService, PrismaService, RedisService],
})
export class EventModule {}
