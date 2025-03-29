import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { PrismaService } from 'src/prisma.service';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { RedisService } from 'src/redis/redis.service';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const filename = `${Date.now()}-${file.originalname.replace(' ', '')}`;
          cb(null, filename);
        },
      }),
    }),
    RedisService,
  ],
  controllers: [EventController],
  providers: [EventService, PrismaService, RedisService],
})
export class EventModule {}
