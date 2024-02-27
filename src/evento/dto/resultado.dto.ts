import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class resultadoDto {
  @ApiProperty({
    type: String,
    default:
      'INCORPORAR ACTIVIDADES DE ASEGURAMIENTO DE LA CALIDAD DEL SOFTWARE DE ACUERDO CON ESTÁNDARES DE LA INDUSTRIA',
    description: 'Resultado de la competencia',
  })
  @IsNotEmpty()
  @IsString()
  readonly resultado: string;

  @ApiProperty({
    type: String,
    default: '1',
    description: 'Orden del resultado',
  })
  @IsNotEmpty()
  @IsNumber()
  readonly orden: number;
}
