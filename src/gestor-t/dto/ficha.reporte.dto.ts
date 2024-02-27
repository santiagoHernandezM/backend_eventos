import { IsMongoId, IsNotEmpty, Matches } from 'class-validator';

export class FichaReporteDto {
  @IsMongoId()
  @Matches(/^(?!\s*$).+/, {
    message: 'El código de la ficha no puede estar vacío',
  })
  @IsNotEmpty()
  readonly ficha: string;
}
