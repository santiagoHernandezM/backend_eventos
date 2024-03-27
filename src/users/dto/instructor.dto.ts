import { ArrayNotEmpty, IsMongoId, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { number } from 'joi';

export class InstructorDto {
  @IsNotEmpty()
  @IsNumber()
  operacion: number;

  @IsString()
  @IsNotEmpty()
  id: string;
}