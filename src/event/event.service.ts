import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Event as EventModel } from '@prisma/client';
import {
  CreateEventBodyType,
  EventType,
  UpdateEventBodyType,
} from './type/event.type';
import {
  createQueryKey,
  getFirstAndLastDateOfMonth,
} from 'src/utils/utilities';
import { RedisService } from 'src/redis/redis.service';
// import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

interface AllEventType {
  list: EventModel[];
  totalCount: number;
}

interface SortDate {
  event_date: 'asc' | 'desc';
}
interface SortName {
  name: 'asc' | 'desc';
}

@Injectable()
export class EventService {
  // private readonly logger = new Logger(EventService.name);
  constructor(
    private readonly prismaService: PrismaService,
    private readonly redisService: RedisService,
    // @InjectPinoLogger(EventService.name)
    // private readonly logger: PinoLogger,
  ) {}

  async getAllEvents(
    creatorId: string,
    pageNumber: string,
    pageSize: string,
    searchQuery?: string,
    filters?: string,
    sortName?: 'asc' | 'desc',
    sortDate?: 'asc' | 'desc',
    dateFilters?: string,
  ): Promise<AllEventType> {
    const searchQueryKey = createQueryKey({
      pageNumber,
      pageSize,
      searchQuery,
      creatorId,
      filters,
      sortName,
      sortDate,
      dateFilters,
    });
    // this.logger.error({ id: 'getAllEvents' }, 'get all events');
    // this.logger.info('This is an informational message');
    const skip = (+Number(pageNumber) - 1) * +Number(pageSize);
    const take = Number(pageSize);
    const whereQuery = {
      name: {
        contains: searchQuery ? searchQuery : undefined,
      },
      creator_id: Number(creatorId),
    };
    const orderBy: Array<SortDate | SortName> = [];

    if (sortDate) {
      orderBy.push({ event_date: sortDate });
    }

    if (sortName) {
      orderBy.push({ name: sortName });
    }

    if (dateFilters) {
      const datesArr = dateFilters.split(',').map((val) => Number(val));

      if (datesArr.includes(1)) {
        const [firstDay, lastDay] = getFirstAndLastDateOfMonth(1);

        whereQuery['event_date'] = {
          lte: new Date(lastDay).toISOString(),
          gte: new Date(firstDay).toISOString(),
        };
      } else if (datesArr.includes(2)) {
        const [, lastDay] = getFirstAndLastDateOfMonth(6);
        whereQuery['event_date'] = {
          lte: new Date(lastDay).toISOString(),
          gte: new Date().toISOString(),
        };
      }
    }

    if (filters) {
      const filterArr = filters.split(',').map((val) => Number(val));
      whereQuery['event_category_id'] = { in: filterArr };
    }

    const cashedEvents = await this.redisService.get('events', searchQueryKey);

    if (cashedEvents) {
      console.log('fetched from cache');
      return JSON.parse(cashedEvents) as AllEventType;
    }

    const [list, totalCount] = await this.prismaService.$transaction([
      this.prismaService.event.findMany({
        skip,
        take,
        where: whereQuery,
        orderBy: orderBy,
      }),
      this.prismaService.event.count({
        where: whereQuery,
        orderBy: orderBy,
      }),
    ]);

    const result = {
      list,
      totalCount,
    };
    console.log('fetched from db');

    await this.redisService.set(
      'events',
      searchQueryKey,
      JSON.stringify(result),
    );

    return result;
  }

  async addEvent(
    filename: string,
    details: CreateEventBodyType,
  ): Promise<EventType> {
    console.log('details', details);
    console.log('converted', new Date(details.date));
    try {
      const event = await this.prismaService.event.create({
        data: {
          name: details.name,
          event_date: new Date(details.date),
          event_category_id: details.categoryId,
          image_url: filename,
          creator_id: details.creatorId,
        },
      });

      console.log('event', event);
      return event;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new BadRequestException();
    }
  }

  async deleteById(id: number): Promise<EventType> {
    console.log('id', id);
    try {
      const deletedUser = await this.prismaService.event.delete({
        where: {
          id: id,
        },
      });

      return deletedUser;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new BadRequestException();
    }
  }

  async updateEvent(
    filename: string,
    details: UpdateEventBodyType,
  ): Promise<EventType> {
    try {
      const data = {};

      if (details.date) {
        data['event_date'] = new Date(details.date);
      }
      if (details.name) {
        data['name'] = details.name;
      }
      if (details.categoryId) {
        data['event_category_id'] = details.categoryId;
      }
      if (filename) {
        data['image_url'] = filename;
      }

      const updatedEvent = await this.prismaService.event.update({
        where: {
          id: details.id,
        },
        data,
      });

      return updatedEvent;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new BadRequestException();
    }
  }
}
