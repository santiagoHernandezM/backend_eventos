import { IsNotEmpty, IsNumber, IsObject, Min } from 'class-validator';
import { CompetenciaReporteDto } from './competencia.reporte.dto';
import { ResultadoReporteDto } from './resultado.reporte.dto';
import { FichaReporteDto } from './ficha.reporte.dto';

export class ReporteFichaDto {
  @IsObject()
  @IsNotEmpty()
  readonly ficha: FichaReporteDto;

  @IsNumber()
  @Min(1, { message: 'Las horas mínimas es 1 hora' })
  readonly horas: number;

  @IsObject()
  @IsNotEmpty()
  readonly competencia: CompetenciaReporteDto;

  @IsObject()
  @IsNotEmpty()
  readonly resultado: ResultadoReporteDto;
}
