import { ArrayNotEmpty, IsMongoId, IsNotEmpty } from 'class-validator';

export class InstructoresProgramaDto {
  @IsNotEmpty()
  @IsMongoId()
  programa: string;

  @IsNotEmpty()
  @ArrayNotEmpty({ each: false })
  instructores: string[];
}
