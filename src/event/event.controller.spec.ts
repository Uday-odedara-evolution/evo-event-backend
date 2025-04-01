import { Test, TestingModule } from '@nestjs/testing';
import { EventController } from './event.controller';
import { EventModule } from './event.module';

describe('EventController', () => {
  let controller: EventController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [EventModule],
    }).compile();

    controller = module.get<EventController>(EventController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  afterAll((done) => {
    done();
  });
});
