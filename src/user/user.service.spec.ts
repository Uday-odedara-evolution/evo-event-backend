import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserModule } from './user.module';

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
        email: 'uday.o@evolutioncloud.in',
        password: '123',
      };

      const result = await service.findUser(
        existingUser.email,
        existingUser.password,
      );

      expect(result).toHaveProperty('email', existingUser.email);
    });

    it('should throw NotFoundException if the user not exists', async () => {
      await expect(service.findUser('abcd@gmail.com', '123')).resolves.toBe(
        null,
      );
    });
  });

  describe('Fetch all users', () => {
    it('should give the list of all users', async () => {
      const users = await service.getAllUser();
      expect(users.length).toBeGreaterThan(0);
    });
  });
});
