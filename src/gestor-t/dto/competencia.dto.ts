import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
} from 'class-validator';
import { resultadoDto } from './resultado.dto';

export class competenciaDto {
  @ApiProperty({
    type: String,
    default: '236236',
    description: 'Código de la competencia',
  })
  @Matches(/^(?!\s*$).+/, {
    message: 'El código de la competencia no puede estar vacío',
  })
  @IsNotEmpty()
  @IsString()
  readonly codigo: string;

  @Matches(/^(?!\s*$).+/, {
    message: 'El nombre de la competencia no puede estar vacío',
  })
  @IsNotEmpty()
  @IsString()
  readonly nombre: string;

  @Matches(/^(?!\s*$).+/, {
    message: 'La duración de la competencia no puede estar vacía',
  })
  @IsNotEmpty()
  @IsNumber()
  readonly duracion: number;

  @IsNotEmpty({ message: 'El acumulado no puede estar vacío' })
  @IsNumber()
  readonly acumulado: number;

  @IsArray()
  @IsNotEmpty({ message: 'Los resultados no pueden estar vacíos' })
  readonly resultados: resultadoDto[];
}
