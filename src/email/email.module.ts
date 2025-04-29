import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from './email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailProcessor } from './email.processor';
import { join } from 'path';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    ConfigModule,
    BullModule.registerQueue({
      name: 'email',
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        auth: {
          user: process.env.SMTP_USERNAME,
          pass: process.env.SMTP_PASSWORD,
        },
      },
      template: {
        dir:
          process.env.NODE_ENV === 'production'
            ? join(__dirname, 'templates')
            : join(process.cwd(), 'src', 'email', 'templates'),
        adapter: new HandlebarsAdapter(),
      },
    }),
    UserModule,
  ],
  providers: [ConfigService, JwtService, EmailService, EmailProcessor],
  exports: [EmailService],
})
export class EmailModule {}
