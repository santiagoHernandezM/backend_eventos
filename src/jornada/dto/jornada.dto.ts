import {
  IsNotEmpty,
  IsString,
  Matches,
  IsMongoId,
  IsNumber,
} from 'class-validator';

export class CrearJornadaDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^(?!\s*$).+/, {
    message: 'El campo nombre no debe estar vacio',
  })
  readonly descripcion: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^(?!\s*$).+/, {
    message: 'El campo nomenclatura no debe estar vacio',
  })
  readonly horaInicio: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^(?!\s*$).+/, {
    message: 'El campo nomenclatura no debe estar vacio',
  })
  readonly horaFin: string;

  @IsNotEmpty()
  @IsNumber()
  readonly horas: number;
}

export class ActualizarJornadaDto {
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
  readonly descripcion: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^(?!\s*$).+/, {
    message: 'El campo nomenclatura no debe estar vacio',
  })
  readonly horaInicio: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^(?!\s*$).+/, {
    message: 'El campo nomenclatura no debe estar vacio',
  })
  readonly horaFin: string;

  @IsNotEmpty()
  @IsNumber()
  readonly horas: number;
}
