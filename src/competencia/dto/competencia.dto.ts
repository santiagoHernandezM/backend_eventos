import { IsMongoId, IsNotEmpty, IsOptional, Matches } from 'class-validator';
import { competenciasDto } from './competencias.dto';
import { ApiProperty } from '@nestjs/swagger';

export class competenciaDto {
  @ApiProperty({ type: String, default: '60f0a9a0e1b7c80f3c0f0b0a' })
  @IsNotEmpty()
  @IsMongoId()
  @Matches(/^(?!\s*$).+/, {
    message: 'El codigo del programa no puede estar vacío',
  })
  readonly programa: string;

  @ApiProperty({ type: [competenciasDto], default: [] })
  @IsOptional()
  @IsNotEmpty()
  readonly competencias: competenciasDto[];
}

export class actualizarCompetenciaDto {
  @ApiProperty({ type: String, default: '60f0a9a0e1b7c80f3c0f0b0a' })
  @IsNotEmpty()
  @Matches(/^(?!\s*$).+/, { message: 'El id no puede ser estar vacío' })
  @IsMongoId()
  readonly id: string;

  @ApiProperty({ type: String, default: '60f0a9a0e1b7c80f3c0f0b0a' })
  @IsNotEmpty()
  @IsMongoId()
  @Matches(/^(?!\s*$).+/, {
    message: 'El codigo del programa no puede estar vacío',
  })
  readonly programa: string;

  @ApiProperty({ type: [competenciasDto], default: [] })
  @IsOptional()
  @IsNotEmpty()
  readonly competencias: competenciasDto[];
}
