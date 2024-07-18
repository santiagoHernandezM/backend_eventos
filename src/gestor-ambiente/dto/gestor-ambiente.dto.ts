import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { CalendarioDto } from './calendario.dto';

export class GestorAmbienteDto {
  @IsMongoId()
  sede: string;

  @IsMongoId()
  centro: string;

  @IsArray()
  ambientes: CreateGestorAmbienteDto[];

  @IsNumber()
  year: number;
}

export class CreateGestorAmbienteDto {
  @IsString()
  @IsNotEmpty()
  readonly nombre: string;

  @IsMongoId()
  @IsNotEmpty()
  readonly id: string;

  @IsNotEmpty()
  readonly calendario: CalendarioDto[];
}

export class AgregarAmbienteGestorDto {
  @IsMongoId()
  sede: string;

  @IsMongoId()
  ambiente: string;

  @IsNotEmpty()
  nomenclatura_codigo: string;
}
