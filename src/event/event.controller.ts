import { Body, Controller, Get, Post, UsePipes } from '@nestjs/common';
import { EventService } from './event.service';
import { ZodValidationPipe } from 'src/utils/zod.validation';
import { CreateEventDto, createEventSchema } from './event.dto';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  getAllPost(): Promise<any> {
    return this.eventService.getAllEvents();
  }

  @Public()
  @Post()
  @UsePipes(new ZodValidationPipe(createEventSchema))
  addPost(@Body() createEventDto: CreateEventDto): Promise<any> {
    console.log('createEventDto', createEventDto);
    return this.eventService.addEvent();
  }
}
