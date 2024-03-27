import { ArrayNotEmpty, IsMongoId, IsNotEmpty } from 'class-validator';
import { InstructorDto } from './instructor.dto';

export class AsignarProgramaDto {
  @IsNotEmpty()
  @IsMongoId()
  programa: string;

  @IsNotEmpty()
  @ArrayNotEmpty({ each: false })
  instructores: InstructorDto[];
}
