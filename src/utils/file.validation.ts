import { PipeTransform, Injectable } from '@nestjs/common';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  transform(value: Express.Multer.File) {
    const ALLOWED_TYPES = ['image/jpg', 'image/jpeg', 'image/png'];

    if (!value) return false;
    if (!ALLOWED_TYPES.includes(value.mimetype)) return false;
    if (value.size > 1000 * 1000 * 5) return false;
    return value;
  }
}
