import { ArrayNotEmpty, IsMongoId, IsNotEmpty } from 'class-validator';

export class AsignarProgramaDto {
  @IsNotEmpty()
  @IsMongoId()
  programa: string;

  @IsNotEmpty()
  @ArrayNotEmpty({ each: false })
  instructores: string[];
}
