import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    email: string,
    password: string,
  ): Promise<{
    access_token: string;
    data: { userId: number; username: string };
  }> {
    const user = await this.userService.findUser(email, password);
    if (!user) {
      throw new NotFoundException('Check cred');
    }
    if (user.password !== password) {
      throw new UnauthorizedException();
    }

    const payload = {
      userId: user.id,
      username: user.username,
      email: user.email,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
      data: payload,
    };
  }
}
