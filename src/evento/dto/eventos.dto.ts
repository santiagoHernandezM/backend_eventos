import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
} from 'class-validator';
import { fichaDto } from './ficha.dto';
import { programaDto } from './programa.dto';
import { ambienteDto } from './ambiente.dto';
import { competenciaDto } from './competencia.dto';
import { resultadoDto } from './resultado.dto';

export class eventosDto {
  @ApiProperty({
    type: fichaDto,
    description: 'Ficha relacionada',
  })
  @IsNotEmpty()
  @IsObject()
  readonly ficha: fichaDto;

  @ApiProperty({
    type: programaDto,
    description: 'Programa relacionado',
  })
  @IsNotEmpty()
  @IsObject()
  readonly programa: programaDto;

  @ApiProperty({
    type: String,
    default: 'Tecnologo',
    description: 'Nivel de formación',
  })
  @IsString()
  readonly nivel: string;

  @ApiProperty({
    type: String,
    default: 'Turbo',
    description: 'Municipio',
  })
  @IsString()
  readonly municipio: string;

  @ApiProperty({
    type: ambienteDto,
    description: 'Ambiente relacionado',
  })
  @IsNotEmpty()
  @IsObject()
  readonly ambiente: ambienteDto;

  @ApiProperty({
    type: String,
    default: 'Lunes',
    description: 'Día de la semana',
  })
  @IsString()
  readonly dia: string;

  @ApiProperty({
    type: String,
    default: '12-18',
    description: 'Horario de formación',
  })
  @IsString()
  readonly horario: string;

  @ApiProperty({
    type: Number,
    default: 32,
    description: 'Horas de formación',
  })
  @IsNumber()
  readonly horas: number;

  @ApiProperty({
    type: Number,
    default: 1,
    description: 'Días trabajados',
  })
  @IsArray()
  readonly diastrabajados: number[];

  @ApiProperty({
    type: competenciaDto,
    description: 'Competencia relacionada',
  })
  @IsNotEmpty()
  @IsObject()
  readonly competencia: competenciaDto;

  @ApiProperty({
    type: resultadoDto,
    description: 'Resultado relacionado',
  })
  @IsNotEmpty()
  @IsObject()
  readonly resultado: resultadoDto;
}
