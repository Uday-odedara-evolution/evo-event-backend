import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserModule } from './user.module';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UserModule],
      controllers: [UserController],
      providers: [UserService, PrismaService, RedisService],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllUsers', () => {
    it('should give users list', async () => {
      const result = [
        {
          id: 1,
          email: 'uday',
          password: '123',
          username: 'uday',
          is_email_verified: false,
        },
      ];

      jest.spyOn(service, 'getAllUser').mockResolvedValue(result);

      const users = await controller.getAllUsers();

      expect(users).toEqual(result);
    });
  });

  // describe('sign in', () => {
  //   it('should give logged in user details', async () => {
  //     const result = {
  //       id: 1,
  //       email: 'uday',
  //       username: 'uday',
  //       isEmailVerified: true,
  //     };
  //     jest.spyOn(service, 'addUser').mockResolvedValue(result);

  //     const newUser = await controller.addUser({
  //       email: 'uday',
  //       password: '123',
  //       username: '132',
  //     });

  //     expect(newUser).toEqual(result);
  //   });
  // });
});
