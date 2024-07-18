import { IsNotEmpty, IsNumber } from 'class-validator';

export class InstructorGestorHorasFicha {
  @IsNotEmpty()
  documento: string;

  @IsNotEmpty()
  nombre: string;

  @IsNotEmpty()
  apellido: string;

  @IsNotEmpty()
  tipoVinculacion: string;

  @IsNumber()
  horas: number = 0;
}
