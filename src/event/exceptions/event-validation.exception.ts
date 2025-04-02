import { HttpException, HttpStatus } from '@nestjs/common';

export class EventValidationException extends HttpException {
  constructor() {
    super(
      'Having issue with event validation',
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }
}
