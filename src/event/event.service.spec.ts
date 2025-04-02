import { Test, TestingModule } from '@nestjs/testing';
import { EventService } from './event.service';
import { EventModule } from './event.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';

const demoEvent = {
  categoryId: 2,
  date: '2025-04-02',
  name: 'test event',
  creatorId: 2,
};

describe('EventService', () => {
  let service: EventService;
  let newEventId: number;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [EventModule],
      providers: [EventService, PrismaService, RedisService],
    }).compile();

    service = module.get<EventService>(EventService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Fetch Events', () => {
    it('should give list of events', async () => {
      const events = await service.getAllEvents({
        creatorId: '2',
        pageNumber: '1',
        pageSize: '1',
      });

      expect(events).toHaveProperty('totalCount');
    });
  });

  describe('Add Event', () => {
    it('should add event into db', async () => {
      const newEvent = await service.addEvent('test.png', demoEvent);
      newEventId = newEvent.id;

      expect(newEvent).toHaveProperty('id');
    });
  });

  describe('Update Event', () => {
    it('should return updated event', async () => {
      const updatedEvent = await service.updateEvent('test2.png', {
        id: newEventId,
      });

      expect(updatedEvent.image_url).toBe('test2.png');
    });
  });

  describe('Delete Event', () => {
    it('Should delete newly added Event', async () => {
      expect(await service.deleteById(newEventId)).toHaveProperty('id');
    });
  });
});
