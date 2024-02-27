import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Matches } from 'class-validator';

export class jornadaDto {
  @ApiProperty({
    type: String,
    description: 'dia de la jornada',
    default: 'Lunes',
  })
  @IsNotEmpty()
  @Matches(/^(?!\s*$).+/, {
    message: 'El día no puede estar vacío',
  })
  readonly dia: string;

  @ApiProperty({
    type: String,
    description: 'jornada de la ficha',
    default: 'jornada',
  })
  @Matches(/^(?!\s*$).+/, { message: 'La jornada no puede estar vacia' })
  @IsNotEmpty()
  readonly jornada: string;

  @ApiProperty({
    type: String,
    description: 'hora de inicio de la jornada',
    default: '07:00',
  })
  @IsNotEmpty()
  readonly horaInicio: string;

  @ApiProperty({
    type: String,
    description: 'hora de finalización de la jornada',
    default: '07:00',
  })
  @IsNotEmpty()
  readonly horaFin: string;
}
