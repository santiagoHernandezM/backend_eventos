import { IsArray, IsNumber } from 'class-validator';
import { InstructorGestorHorasFicha } from './instructor-gestor-horas-ficha.dto';

export class MesGestorHorasFicha {
  @IsNumber()
  mes: number;

  @IsArray()
  instructores: InstructorGestorHorasFicha[] = [];
}
