import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { NewUser } from 'src/user/user.interface';
import { EmailService } from 'src/email/email.service';
import { ResetPasswordDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly emailService: EmailService,
  ) {}

  async signIn(email: string, password: string): Promise<NewUser> {
    const user = await this.userService.findUser(email, password);

    if (!user) {
      throw new NotFoundException();
    }

    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
      isEmailVerified: user.is_email_verified,
    };

    return payload;
  }

  async resetPassword(data: ResetPasswordDto) {
    try {
      const email = await this.emailService.decodeConfirmationToken(data.token);

      if (email) {
        await this.userService.updatePassword(email, data.password);
      }

      return { message: 'New Password has been updated' };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
