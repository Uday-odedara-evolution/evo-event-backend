import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Mail } from './email.interface';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { NewUser } from 'src/user/user.interface';

@Injectable()
export class EmailService {
  constructor(
    @InjectQueue('email') private readonly emailQueue: Queue,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async sendWelcomeEmail(data: NewUser) {
    const job = await this.emailQueue.add('welcome', data);

    this.emailQueue.on('error', (error) => {
      // eslint-disable-next-line no-console
      console.error('Queue Error:', error);
    });

    this.emailQueue.on('waiting', (jobId) => {
      // eslint-disable-next-line no-console
      console.log(`Job  is waiting to be processed`, jobId);
    });

    return { jobId: job.id };
  }

  async sendResetPasswordEmail(data: Mail) {
    const job = await this.emailQueue.add('reset-password', { data });

    return { jobId: job.id };
  }

  async sendVerificationLink(email: string) {
    const job = await this.emailQueue.add('verification', email);

    return { jobId: job.id };
  }

  async decodeConfirmationToken(token: string) {
    try {
      const payload: { email: string } = await this.jwtService.verify(token, {
        secret: process.env.JWT_VERIFICATION_TOKEN_SECRET,
      });

      if (typeof payload === 'object' && 'email' in payload) {
        return payload.email;
      }

      throw new BadRequestException();
    } catch (error) {
      if (
        error &&
        typeof error === 'object' &&
        'name' in error &&
        error.name === 'TokenExpiredError'
      ) {
        throw new BadRequestException('Email confirmation token expired');
      }
      throw new BadRequestException('Bad confirmation token');
    }
  }

  async verifyEmail(email: string) {
    const user = await this.userService.findByEmail(email);

    if (user?.is_email_verified) {
      throw new BadRequestException('Email already confirmed');
    }

    return await this.userService.markEmailAsConfirmed(email);
  }
}
