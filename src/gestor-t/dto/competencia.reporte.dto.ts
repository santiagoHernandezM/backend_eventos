import { Matches } from 'class-validator';

export class CompetenciaReporteDto {
  @Matches(/^(?!\s*$).+/, {
    message: 'El código de la competencia no puede estar vacío',
  })
  readonly codigo: string;
}
