import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class ReporteHorasDto {
  @IsArray()
  reporte: ReporteDto[];

  @IsNumber()
  mes: number;

  @IsNumber()
  year: number;

  @IsNotEmpty()
  id_instructor: string;
}

export class ReporteDto {
  @IsNotEmpty()
  codigo_ficha: string;

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
