import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class ValidateObjectidPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!isValidObjectId(value)) {
      throw new BadRequestException(`'${value}' no es un mongoId válido`);
    }

    return value;
  }
}
