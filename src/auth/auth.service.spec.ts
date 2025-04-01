import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AuthModule } from './auth.module';
import { NotFoundException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
      providers: [
        AuthService,
        UserService,
        JwtService,
        PrismaService,
        RedisService,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sign in user', () => {
    it('should return user details', async () => {
      const existingUser = {
        email: 'test@gmail.com',
        password: '123',
      };

      const result = await service.signIn(
        existingUser.email,
        existingUser.password,
      );

      expect(result).toHaveProperty('access_token');
    });

    it('should throw NotFoundException if the user not exists', async () => {
      await expect(service.signIn('abcd', '123')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
