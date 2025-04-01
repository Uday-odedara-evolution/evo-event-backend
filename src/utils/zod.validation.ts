import { PipeTransform, BadRequestException } from '@nestjs/common';
import { ZodSchema } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: string | number) {
    try {
      const parsedValue = this.schema.parse(value) as string | number;
      return parsedValue;
    } catch (error) {
      console.log('zod error', error);
      throw new BadRequestException('Validation failed');
    }
  }
}
