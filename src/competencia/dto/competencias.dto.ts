import { IsNotEmpty, IsNumber, IsOptional, Matches } from 'class-validator';
import { resultadoDto } from './resultado.dto';
import { ApiProperty } from '@nestjs/swagger';

export class competenciasDto {
  @ApiProperty({ type: String, default: '60f0a9a0e1b7c80f3c0f0b0a' })
  @IsNotEmpty()
  @Matches(/^(?!\s*$).+/, {
    message: 'El codigo del programa no puede estar vacío',
  })
  readonly codigo: string;

  @ApiProperty({ type: String, default: 'Nombre de la competencia' })
  @Matches(/^(?!\s*$).+/, { message: 'El nombre no puede ser estar vacío' })
  @IsNotEmpty()
  readonly nombre: string;

  @ApiProperty({ type: String, default: 12 })
  @Matches(/^(?!\s*$).+/, { message: 'La duración no puede ser estar vacío' })
  @IsNumber()
  @IsNotEmpty()
  readonly duracion: number;

  @ApiProperty({ type: [resultadoDto], default: [] })
  @IsOptional()
  @IsNotEmpty()
  readonly resultados: resultadoDto[];
}
