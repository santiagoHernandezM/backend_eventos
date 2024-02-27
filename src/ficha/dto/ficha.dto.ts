import {
  IsMongoId,
  IsNotEmpty,
  IsString,
  Matches,
  IsDateString,
  // IsObject,
  IsArray,
} from 'class-validator';
import { jornadaDto } from './jornadaDto';
import { ApiProperty } from '@nestjs/swagger';
export class FichaDto {
  @ApiProperty({
    type: String,
    description: 'codigo de la ficha',
    default: '123456',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^(?!\s*$).+/, { message: 'El codigo no puede ser estar vacío' })
  readonly codigo: string;

  @ApiProperty({
    type: String,
    description: 'fecha de inicio de la ficha',
    default: '2021-01-01',
  })
  @IsNotEmpty()
  @IsDateString()
  readonly fechaInicio: Date;

  @ApiProperty({
    type: String,
    description: 'fecha de fin de la ficha',
    default: '2021-12-31',
  })
  @IsNotEmpty()
  @IsDateString()
  readonly fechaFin: Date;

  @ApiProperty({
    type: String,
    description: 'sede de la ficha',
    default: 'sede',
  })
  @IsNotEmpty()
  @IsMongoId()
  @Matches(/^(?!\s*$).+/, { message: 'sede no puede ser estar vacío' })
  readonly sede: string;

  @ApiProperty({
    type: String,
    description: 'ambiente de la ficha',
    default: 'ambiente',
  })
  @IsNotEmpty()
  @IsMongoId()
  @Matches(/^(?!\s*$).+/, { message: 'ambiente no puede ser estar vacío' })
  readonly ambiente: string;

  @ApiProperty({
    type: String,
    description: 'programa de la ficha',
    default: 'programa',
  })
  @IsNotEmpty()
  @IsMongoId()
  @Matches(/^(?!\s*$).+/, { message: 'programa no puede ser estar vacío' })
  readonly programa: string;

  @ApiProperty({
    type: String,
    description: 'instructor de la ficha',
    default: 'instructor',
  })
  @IsNotEmpty()
  @IsMongoId()
  @Matches(/^(?!\s*$).+/, { message: 'instructor no puede ser estar vacío' })
  readonly instructor: string;

  @ApiProperty({ type: [jornadaDto], description: 'jornadas de la ficha' })
  @IsNotEmpty()
  @IsArray()
  readonly jornadas: jornadaDto[];
}

export class ActualizarFichaDto {
  @ApiProperty({
    type: String,
    description: 'id de la ficha',
    default: '123456',
  })
  @IsNotEmpty()
  @Matches(/^(?!\s*$).+/, { message: 'El id no puede ser estar vacío' })
  @IsMongoId()
  readonly id: string;

  @ApiProperty({
    type: String,
    description: 'codigo de la ficha',
    default: '123456',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^(?!\s*$).+/, { message: 'El codigo no puede ser estar vacío' })
  readonly codigo: string;

  @ApiProperty({
    type: String,
    description: 'fecha de inicio de la ficha',
    default: '2021-01-01',
  })
  @IsNotEmpty()
  @IsDateString()
  readonly fechaInicio: Date;

  @ApiProperty({
    type: String,
    description: 'fecha de fin de la ficha',
    default: '2021-12-31',
  })
  @IsNotEmpty()
  @IsDateString()
  readonly fechaFin: Date;

  @ApiProperty({
    type: String,
    description: 'sede de la ficha',
    default: 'sede',
  })
  @IsNotEmpty()
  @IsMongoId()
  @Matches(/^(?!\s*$).+/, { message: 'sede no puede ser estar vacío' })
  readonly sede: string;

  @ApiProperty({
    type: String,
    description: 'ambiente de la ficha',
    default: 'ambiente',
  })
  @IsNotEmpty()
  @IsMongoId()
  @Matches(/^(?!\s*$).+/, { message: 'ambiente no puede ser estar vacío' })
  readonly ambiente: string;

  @ApiProperty({
    type: String,
    description: 'programa de la ficha',
    default: 'programa',
  })
  @IsNotEmpty()
  @IsMongoId()
  @Matches(/^(?!\s*$).+/, { message: 'programa no puede ser estar vacío' })
  readonly programa: string;

  @ApiProperty({
    type: String,
    description: 'instructor de la ficha',
    default: 'instructor',
  })
  @IsNotEmpty()
  @IsMongoId()
  @Matches(/^(?!\s*$).+/, { message: 'instructor no puede ser estar vacío' })
  readonly instructor: string;

  @ApiProperty({ type: [jornadaDto], description: 'jornadas de la ficha' })
  @IsNotEmpty()
  @IsArray()
  readonly jornadas: jornadaDto[];
}
