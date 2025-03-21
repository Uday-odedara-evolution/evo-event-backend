import { Controller, Get, Post } from '@nestjs/common';
import { DemoService } from './demo.service';

@Controller('demo')
export class DemoController {
  constructor(private readonly demoService: DemoService) {}

  @Get()
  getDemo() {
    return this.demoService.getDemo();
  }

  @Post('')
  postDemo() {
    return 'this is post test';
  }
}
