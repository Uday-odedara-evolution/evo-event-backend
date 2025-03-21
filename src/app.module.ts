import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { EventModule } from './event/event.module';

@Module({
  imports: [AuthModule, UserModule, EventModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
