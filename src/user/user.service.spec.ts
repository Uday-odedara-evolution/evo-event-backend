import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserModule } from './user.module';
import { NotFoundException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UserModule],
    }).compile();

    service = module.get<UserService>(UserService);
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

      const result = await service.findUser(
        existingUser.email,
        existingUser.password,
      );

      expect(result).toHaveProperty('email', existingUser.email);
    });

    it('should throw NotFoundException if the user not exists', async () => {
      await expect(service.findUser('abcd', '123')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should give the list of all users', async () => {
      const users = await service.getAllUser();
      expect(users.length).toBeGreaterThan(0);
    });
  });
});
