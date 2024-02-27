import { IsArray, IsNotEmpty } from 'class-validator';
import { ReporteFichaDto } from './reporte.dto';

export class EventosReporteDto {
  @IsArray()
  @IsNotEmpty()
  readonly eventos: ReporteFichaDto[];
}
