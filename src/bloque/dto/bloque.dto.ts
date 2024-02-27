import { IsNotEmpty, IsString, Matches, IsMongoId } from 'class-validator';

export class CrearBloqueDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^(?!\s*$).+/, {
    message: 'El campo nombre no debe estar vacio',
  })
  readonly nombre: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^(?!\s*$).+/, {
    message: 'El campo nomenclatura no debe estar vacio',
  })
  readonly nomenclatura: string;

  @Matches(/^(?!\s*$).+/, { message: 'La sede no puede ser estar vacío' })
  @IsNotEmpty()
  @IsMongoId()
  readonly sede: string;
}

export class ActualizarBloqueDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^(?!\s*$).+/, {
    message: 'El campo id es obligatorio',
  })
  @IsMongoId()
  readonly id: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^(?!\s*$).+/, {
    message: 'El campo nombre no debe estar vacio',
  })
  readonly nombre?: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^(?!\s*$).+/, {
    message: 'El campo nomenclatura no debe estar vacio',
  })
  readonly nomenclatura?: string;

  @Matches(/^(?!\s*$).+/, { message: 'La sede no puede ser estar vacío' })
  @IsNotEmpty()
  @IsMongoId()
  readonly sede: string;
}
