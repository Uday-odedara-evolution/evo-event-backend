import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './auth/decorators/public.decorator';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@Public()
@Controller()
@ApiTags('App')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiResponse({
    example: 'Hello world',
  })
  getHello(): string {
    return this.appService.getHello();
  }
}
