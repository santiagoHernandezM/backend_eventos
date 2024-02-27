import { IsNotEmpty, IsNumber } from 'class-validator';

export class CalendarioDto {
  @IsNotEmpty()
  @IsNumber()
  morning: number;

  @IsNotEmpty()
  @IsNumber()
  afternoon: number;

  @IsNotEmpty()
  @IsNumber()
  night: number;
}
