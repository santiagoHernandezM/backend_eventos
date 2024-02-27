import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Matches } from 'class-validator';

export class resultadoDto {
  @ApiProperty({
    type: String,
    default: 'Resultado de la competencia',
    description: 'Resultado de la competencia',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^(?!\s*$).+/, {
    message: 'La descripcion del resultado no puede estar vacío',
  })
  readonly descripcion: string;

  @ApiProperty({
    type: String,
    description: 'Duración del resultado de la competencia',
  })
  @IsNotEmpty()
  @Matches(/^(?!\s*$).+/, {
    message: 'La duración del resultado no puede estar vacío',
  })
  @IsNumber()
  readonly duracion: number;

  @IsNotEmpty()
  @Matches(/^(?!\s*$).+/, {
    message: 'El acumulado del resultado no puede estar vacío',
  })
  @IsNumber()
  readonly acumulado: number;

  @ApiProperty({
    type: Number,
    default: 1,
    description: 'Orden del resultado',
  })
  @Matches(/^(?!\s*$).+/, {
    message: 'El orden del resultado no puede estar vacío',
  })
  @IsNotEmpty()
  @IsString()
  readonly orden: string;
}
