import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthModule } from './auth.module';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';
import { UserService } from 'src/user/user.service';
import { EmailService } from 'src/email/email.service';
import { EmailModule } from 'src/email/email.module';
import { UserModule } from 'src/user/user.module';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule, EmailModule, UserModule],
      providers: [
        AuthService,
        UserService,
        PrismaService,
        RedisService,
        EmailService,
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login controller', () => {
    it('should give you user details with access token', async () => {
      const result = {
        id: 1,
        email: 'test@gmail.com',
        username: 'uday',
        isEmailVerified: false,
      };

      jest.spyOn(service, 'signIn').mockResolvedValue(result);

      const user = await service.signIn('test@gmail.com', '123');
      expect(user).toEqual(result);
    });
  });
});
