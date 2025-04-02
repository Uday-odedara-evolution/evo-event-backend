import { PipeTransform } from '@nestjs/common';
import { ZodSchema, ZodTypeAny } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown) {
    const parsedValue = this.schema.parse(value) as ZodTypeAny;
    return parsedValue;
  }
}
