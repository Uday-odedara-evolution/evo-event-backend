import { Test, TestingModule } from '@nestjs/testing';
import { EventController } from './event.controller';
import { EventModule } from './event.module';
import { EventService } from './event.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';

const demoResultEvent = {
  id: 19,
  event_date: new Date('2025-04-04'),
  event_category_id: 1,
  creator_id: 2,
  image_url: '1743595443188-daryan-shamkhali-PACD5oSMko8-unsplash.jpg',
  name: 'test',
};

describe('EventController', () => {
  let controller: EventController;
  let service: EventService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [EventModule],
      providers: [EventService, PrismaService, RedisService],
    }).compile();

    controller = module.get<EventController>(EventController);
    service = module.get<EventService>(EventService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  afterAll((done) => {
    done();
  });

  describe('Fetch all events', () => {
    it('should give list of all events', async () => {
      const demoList = {
        list: [
          {
            id: 5,
            name: 'dancing concert',
            event_date: new Date('2022-03-25'),
            event_category_id: 2,
            creator_id: 2,
            image_url: '1742984214161-lala-azizli-SC9LreeZDj0-unsplash.jpg',
          },
        ],
        totalCount: 12,
      };

      jest.spyOn(service, 'getAllEvents').mockResolvedValue(demoList);

      const events = await controller.getAllPost({
        pageNumber: '1',
        pageSize: '1',
        creatorId: '2',
      });

      expect(events).toEqual(demoList);
    });
  });

  describe('Delete event', () => {
    it('should delete event', async () => {
      jest.spyOn(service, 'deleteById').mockResolvedValue(demoResultEvent);

      const result = await controller.deleteEvent(1);

      expect(result).toHaveProperty('id');
    });
  });
});
