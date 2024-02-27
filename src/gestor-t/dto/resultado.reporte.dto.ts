import { IsNumber } from 'class-validator';

export class ResultadoReporteDto {
  @IsNumber()
  readonly orden: number;
}
