import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsOptional, Matches } from 'class-validator';
export class CentroDto {
  @ApiProperty({
    type: String,
    description: 'Código del Centro',
    default: '0123456789',
  })
  @IsNotEmpty()
  readonly codigo: string;

  @ApiProperty({
    type: String,
    description: 'Nombre del centro',
    default: 'Centro de Industria y Construcción',
  })
  @IsNotEmpty()
  readonly nombre: string;

  @ApiProperty({
    type: String,
    description: 'ObjectId de la regional',
    default: '647b9c8b6d094d14b42f8a98',
  })
  @IsNotEmpty()
  @IsMongoId()
  readonly regional: string;

  @ApiProperty({
    type: String,
    description: 'Municipio del Centro',
    default: 'Montería',
  })
  @IsNotEmpty()
  readonly municipio: string;
}

export class ActualizarCentroDto {
  @IsNotEmpty()
  @Matches(/^(?!\s*$).+/, { message: 'El id no puede ser estar vacío' })
  @IsMongoId()
  readonly id: string;

  @IsNotEmpty()
  @Matches(/^(?!\s*$).+/, { message: 'El codigo no puede ser estar vacío' })
  @IsOptional()
  readonly codigo: string;

  @IsNotEmpty()
  @Matches(/^(?!\s*$).+/, { message: 'El nombre no puede ser estar vacío' })
  @IsOptional()
  readonly nombre: string;

  @IsNotEmpty()
  @Matches(/^(?!\s*$).+/, { message: 'La regional no puede ser estar vacía' })
  @IsOptional()
  readonly regional: string;

  @IsNotEmpty()
  @Matches(/^(?!\s*$).+/, { message: 'El municipio no puede ser estar vacío' })
  @IsOptional()
  readonly municipio: string;
}
