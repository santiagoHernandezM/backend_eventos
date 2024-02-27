import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsMongoId,
  Matches,
} from 'class-validator';

export class CreatedAmbienteDTO {
  @IsNotEmpty()
  @IsString()
  readonly codigo: string;

  @IsNotEmpty()
  @IsString()
  readonly bloque: string;

  @IsNotEmpty()
  @IsString()
  readonly tipo: string;

  @IsNotEmpty()
  @IsString()
  readonly sede: string;
}

export class UpdateAmbienteDTO {
  @IsNotEmpty()
  @IsString()
  @Matches(/^(?!\s*$).+/, {
    message: 'El campo id es obligatorio',
  })
  @IsMongoId()
  readonly id: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  readonly bloque: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  readonly tipo: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  readonly sede: string;
}
