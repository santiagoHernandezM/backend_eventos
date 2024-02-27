import { IsObject, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { FichaReporteDto } from './ficha.reporte.dto';
import { CompetenciaReporteDto } from './competencia.reporte.dto';
import { ResultadoReporteDto } from './resultado.reporte.dto';

export class RestarTiempoFichaDto {
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
