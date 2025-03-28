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
} from './event.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileValidationPipe } from 'src/utils/file.validation';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Public()
  @Get()
  getAllPost(
    @Query('pageSize') pageSize: string,
    @Query('pageNumber') pageNumber: string,
    @Query('searchQuery') searchQuery: string,
    @Query('creatorId') creatorId: string,
    @Query('filters') filters: string,
    @Query('dFilters') dFilters: string,
    @Query('sortName') sortName: 'asc' | 'desc',
    @Query('sortDate') sortDate: 'asc' | 'desc',
  ): Promise<any> {
    return this.eventService.getAllEvents(
      pageNumber,
      pageSize,
      searchQuery,
      creatorId,
      filters,
      sortName,
      sortDate,
      dFilters,
    );
  }

  @Public()
  @Post()
  @UseInterceptors(FileInterceptor('file'))
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
  @UsePipes(new ZodValidationPipe(deleteEventSchema))
  deleteEvent(@Param('id') deleteEventDto: DeleteEventDto) {
    return this.eventService.deleteById(deleteEventDto);
  }

  @Public()
  @Put()
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
