import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Event as EventModel } from '@prisma/client';

@Injectable()
export class EventService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllEvents(): Promise<EventModel[]> {
    const events = await this.prismaService.event.findMany();
    return events;
  }

  async addEvent(): Promise<string> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('event added');
        // return 'event added';
      }, 2000);
    });
  }
}
