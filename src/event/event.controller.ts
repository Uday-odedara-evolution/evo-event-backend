import { Controller, Get, Post } from '@nestjs/common';
import { EventService } from './event.service';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  getAllPost(): Promise<any> {
    return this.eventService.getAllEvents();
  }

  @Post()
  addPost(): Promise<any> {
    return this.eventService.addEvent();
  }
}
