import { IsNotEmpty, IsString, Matches, IsMongoId } from 'class-validator';

export class TipoDeVinculacionDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^(?!\s*$).+/, {
    message: 'El campo nombre no debe estar vacio',
  })
  readonly nombre: string;
}

export class ActualizarTipoDeVinculacionDto {
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
}
