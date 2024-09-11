import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class ReporteHorasDto {
  @IsArray()
  reporte: ReporteMesesDto[];

  @IsNumber()
  year: number;

  @IsNotEmpty()
  id_instructor: string;
}

export class ReporteMesesDto {
  @IsNotEmpty()
  codigo_ficha: string;

  @IsArray()
  meses: ReporteMesDto[];
}
export class ReporteMesDto {
  @IsNumber()
  mes: number;

  @IsNumber()
  horas: number;
}

export class RestarHorasFichaDto {
  @IsNotEmpty()
  id_instructor: string;

  @IsNotEmpty()
  codigo_ficha: string;

  @IsNumber()
  horas: number;

  @IsNumber()
  mes: number;

  @IsNumber()
  year: number;
}
