import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { CalendarioDto } from './calendario.dto';

export class CreateGestorAmbienteDto {
  @IsString()
  @IsNotEmpty()
  readonly nombre: string;

  @IsMongoId()
  @IsNotEmpty()
  readonly ambiente: string;

  @IsNotEmpty()
  readonly calendario: CalendarioDto[];
}
