import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { EventService } from './event.service';
import { ZodValidationPipe } from 'src/utils/zod.validation';
import {
  CreateEventDto,
  UpdateEventDto,
  DeleteEventDto,
  createEventSchema,
  deleteEventSchema,
  updateEventSchema,
  GetEventDto,
  getEventsSchema,
} from './dto/event.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileValidationPipe } from 'src/utils/file.validation';
import { ApiBody, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('event')
@ApiTags('Events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Public()
  @Get()
  @ApiQuery({
    name: 'searchQuery',
    description: 'Event list including entered keywords',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'filters',
    description: 'Get the event list with specific event type',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'dFilters',
    description: 'Get the event list with specific date range',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'sortDate',
    description: 'Sort the list with asc and desc date',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'sortName',
    description: 'Sort the list with asc and desc name',
    required: false,
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'List of user created events',
    example: {
      list: [
        {
          id: 5,
          name: 'dancing concert',
          event_date: '2025-04-03T00:00:00.000Z',
          event_category_id: 2,
          creator_id: 2,
          image_url: '1742984214161-lala-azizli-SC9LreeZDj0-unsplash.jpg',
        },
      ],
      totalCount: 13,
    },
  })
  @UsePipes(new ZodValidationPipe(getEventsSchema))
  getAllPost(@Query() query: GetEventDto): Promise<any> {
    return this.eventService.getAllEvents({
      ...query,
      dateFilters: query.dFilters,
    });
  }

  @Public()
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({
    schema: {
      example: {
        name: 'name',
        date: '2025-03-31',
        categoryId: '1',
        file: 'abc.jpg',
        creatorId: '1',
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Event is successfully created',
    example: {
      id: 18,
      name: 'test 11',
      event_date: '2025-03-31T00:00:00.000Z',
      event_category_id: 1,
      creator_id: 2,
      image_url: '1743403897088-daryan-shamkhali-PACD5oSMko8-unsplash.jpg',
    },
  })
  addEvent(
    @Body(new ZodValidationPipe(createEventSchema))
    createEventDto: CreateEventDto,
    @UploadedFile(new FileValidationPipe()) file: Express.Multer.File,
  ): Promise<any> {
    if (!file) {
      throw new NotFoundException('file error');
    }

    return this.eventService.addEvent(file.filename, createEventDto);
  }

  @Public()
  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Event is deleted',
    example: {
      id: 18,
      name: 'test 11',
      event_date: '2025-03-31T00:00:00.000Z',
      event_category_id: 1,
      creator_id: 2,
      image_url: '1743403897088-daryan-shamkhali-PACD5oSMko8-unsplash.jpg',
    },
  })
  deleteEvent(
    @Param('id', new ZodValidationPipe(deleteEventSchema))
    deleteEventDto: DeleteEventDto,
  ) {
    return this.eventService.deleteById(deleteEventDto);
  }

  @Public()
  @Put()
  @ApiBody({
    schema: {
      example: {
        id: '12',
        name: 'name',
        date: '2025-03-31',
        categoryId: '1',
        file: 'abc.jpg',
        creatorId: '1',
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Event is successfully created',
    example: {
      id: 18,
      name: 'test 11',
      event_date: '2025-03-31T00:00:00.000Z',
      event_category_id: 1,
      creator_id: 2,
      image_url: '1743403897088-daryan-shamkhali-PACD5oSMko8-unsplash.jpg',
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  updateEvent(
    @Body(new ZodValidationPipe(updateEventSchema))
    updateEventDto: UpdateEventDto,
    @UploadedFile(new FileValidationPipe())
    file: Express.Multer.File,
  ): Promise<any> {
    return this.eventService.updateEvent(file.filename, updateEventDto);
  }
}
