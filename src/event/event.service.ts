import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Event as EventModel } from '@prisma/client';
import {
  CreateEventBodyType,
  EventType,
  UpdateEventBodyType,
} from './type/event.type';

interface AllEventType {
  list: EventModel[];
  totalCount: number;
}

@Injectable()
export class EventService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllEvents(
    pageNumber: string,
    pageSize: string,
    searchQuery: string,
  ): Promise<AllEventType> {
    const skip = (+Number(pageNumber) - 1) * +Number(pageSize);
    console.log('skip', skip);
    const take = Number(pageSize);
    const whereQuery = {
      name: {
        contains: searchQuery ? searchQuery : undefined,
      },
    };

    const [list, totalCount] = await this.prismaService.$transaction([
      this.prismaService.event.findMany({
        skip,
        take,
        where: whereQuery,
      }),
      this.prismaService.event.count(),
    ]);
    return {
      list,
      totalCount,
    };
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
    } catch (error) {
      throw new HttpException(error.toString(), HttpStatus.BAD_REQUEST);
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
    } catch (error) {
      throw new HttpException(error.toString(), HttpStatus.BAD_REQUEST);
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
    } catch (error) {
      console.log('error', error);
      throw new HttpException(error.toString(), HttpStatus.BAD_REQUEST);
    }
  }
}
