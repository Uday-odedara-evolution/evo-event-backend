import { Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { NewUser } from 'src/user/user.interface';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

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
}
