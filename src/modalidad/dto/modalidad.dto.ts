import { IsMongoId, IsString, Matches } from 'class-validator';

export class ModalidadDto {
  @Matches(/^(?!\s*$).+/, {
    message: 'El nombre del tipo de vinculación no puede estar vacío',
  })
  readonly nombre: string;
}

export class ActualizarModalidadDto {
  @Matches(/^(?!\s*$).+/, {
    message: 'El id no puede estar vacío',
  })
  @IsMongoId()
  readonly id: string;

  @Matches(/^(?!\s*$).+/, {
    message: 'El nombre del tipo de vinculación no puede estar vacío',
  })
  @IsString()
  readonly nombre: string;
}
