import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsOptional, Matches } from 'class-validator';

export class ProgramaDto {
  @ApiProperty({
    type: String,
    description: 'codigo del programa',
    default: '123456',
  })
  @IsNotEmpty()
  @Matches(/^(?!\s*$).+/, {
    message: 'El codigo del programa no puede estar vacío',
  })
  readonly codigo: string;

  @ApiProperty({
    type: String,
    description: 'Nombre del programa',
    default: 'Análisis y desarrollo de software',
  })
  @Matches(/^(?!\s*$).+/, { message: 'El nombre no puede ser estar vacío' })
  @IsNotEmpty()
  readonly nombre: string;

  @ApiProperty({
    type: String,
    description: 'Nivel de formación',
    default: 'Tecnólogo',
  })
  @Matches(/^(?!\s*$).+/, {
    message: 'El nivel de formacion no puede ser estar vacío',
  })
  @IsNotEmpty()
  readonly nivel: string;

  @ApiProperty({
    type: String,
    description: 'La versión del programa',
    default: '10',
  })
  @IsNotEmpty()
  readonly version: string;

  @ApiProperty({
    type: Number,
    description: 'La duración de la competencia en horas',
    default: 40,
  })
  @Matches(/^(?!\s*$).+/, { message: 'La duración no puede ser estar vacío' })
  @IsNotEmpty()
  readonly duracion: number;

  @ApiProperty({
    type: Number,
    description: 'La intensidad horaria en horas',
    default: 6,
  })
  @IsNotEmpty()
  readonly intensidad_horaria: number;
}

export class ActualizarProgramaDto {
  @ApiProperty({
    type: String,
    description: 'El ObjectId del programa',
    default: '12345678',
  })
  @IsNotEmpty()
  @IsMongoId()
  // @Matches(/^(?!\s*$).+/, { message: 'El Id no puede ser estar vacío' })
  @IsOptional()
  readonly id: string;
  
  @ApiProperty({
    type: String,
    description: 'codigo del programa',
    default: '123456',
  })
  @IsOptional()
  @IsNotEmpty()
  // @Matches(/^(?!\s*$).+/, {
  //   message: 'El codigo del programa no puede estar vacío',
  // })
  readonly codigo: string;
  
  @ApiProperty({
    type: String,
    description: 'Nombre del programa',
    default: 'Análisis y desarrollo de software',
  })
  // @Matches(/^(?!\s*$).+/, { message: 'El nombre no puede ser estar vacío' })
  @IsOptional()
  @IsNotEmpty()
  readonly nombre: string;
  
  @ApiProperty({
    type: String,
    description: 'Nivel de formación',
    default: 'Tecnólogo',
  })
  // @Matches(/^(?!\s*$).+/, {
  //   message: 'El nivel de formacion no puede ser estar vacío',
  // })
  @IsOptional()
  @IsNotEmpty()
  readonly nivel: string;
  
  @ApiProperty({
    type: String,
    description: 'La versión del programa',
    default: '1.0',
  })
  @IsOptional()
  @IsNotEmpty()
  readonly version: string;
  
  @ApiProperty({
    type: Number,
    description: 'La duración de la competencia en horas',
    default: 40,
  })
  // @Matches(/^(?!\s*$).+/, { message: 'La version no puede ser estar vacío' })
  @IsOptional()
  @IsNotEmpty()
  readonly duracion: number;
  
  @ApiProperty({
    type: Number,
    description: 'La intensidad horaria en horas',
    default: 6,
  })
  @IsOptional()
  @IsNotEmpty()
  readonly intensidad_horaria: number;
}
