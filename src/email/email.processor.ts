import { MailerService } from '@nestjs-modules/mailer';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { NewUser } from 'src/user/user.interface';

@Processor('email')
export class EmailProcessor {
  constructor(
    private readonly mailService: MailerService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  @Process('welcome')
  async sendWelcomeEmail(job: Job<NewUser>) {
    try {
      const { data } = job;

      const token = this.jwtService.sign(
        { email: data.email },
        {
          secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
          expiresIn: this.configService.get(
            'JWT_VERIFICATION_TOKEN_EXPIRATION_TIME',
          ),
        },
      );

      const url = `${process.env.EMAIL_CONFIRMATION_URL ?? ''}?token=${token}`;

      await this.mailService.sendMail({
        to: data.email,
        from: 'testing@evolutioncloud.in',
        subject: 'Welcome Email',
        template: 'welcome',
        context: {
          name: 'uday',
          link: url,
        },
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('send email error', error);
    }
  }

  @Process('verification')
  async sendVerificationEmail(job: Job<{ email: string }>) {
    try {
      const { data } = job;
      const token = this.jwtService.sign(
        { email: data.email },
        {
          secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
          expiresIn: this.configService.get(
            'JWT_VERIFICATION_TOKEN_EXPIRATION_TIME',
          ),
        },
      );

      const url = `${process.env.EMAIL_CONFIRMATION_URL ?? ''}?token=${token}`;

      await this.mailService.sendMail({
        to: data.email,
        from: 'testing@evolutioncloud.in',
        subject: 'Verification of email',
        template: 'verify-email',
        context: {
          verificationLink: url,
        },
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('Error while sending verification link', error);
    }
  }

  // async sendResetPasswordEmail(job: Job<Mail>) {
  //   const { data } = job;
  // }
}
