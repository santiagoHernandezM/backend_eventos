import { ArrayNotEmpty, IsMongoId, IsNotEmpty } from 'class-validator';

export class AsignarProgramasDto {
  @IsNotEmpty()
  @IsMongoId()
  programa: string;

  @IsNotEmpty()
  @ArrayNotEmpty({ each: false })
  instructores: string[];
}
