import {
  IsNotEmpty,
  Length,
  IsOptional,
  IsString,
  IsMongoId,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegionalDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(1, 10)
  readonly codigo: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly nombre: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly departamento: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly municipio: string;
}

export class ActualizarRegionalDto {
  @IsMongoId()
  readonly id: string;

  @IsNotEmpty()
  @IsOptional()
  readonly codigo: string;

  @IsNotEmpty()
  @IsOptional()
  readonly nombre: string;

  @IsNotEmpty()
  @IsOptional()
  readonly departamento: string;

  @IsNotEmpty()
  @IsOptional()
  readonly municipio: string;
}
