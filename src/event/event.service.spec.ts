import { Test, TestingModule } from '@nestjs/testing';
import { EventService } from './event.service';
import { EventModule } from './event.module';

describe('EventService', () => {
  let service: EventService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [EventModule],
    }).compile();

    service = module.get<EventService>(EventService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
