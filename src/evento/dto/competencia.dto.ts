import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class competenciaDto {
  @ApiProperty({
    type: String,
    default:
      'Controlar la calidad del servicio de software de acuerdo con los estándares técnicos',
    description: 'Nombre de la competencia',
  })
  @IsNotEmpty()
  @IsString()
  readonly competencia: string;

  @ApiProperty({
    type: String,
    default: '220501098',
    description: 'Código de la competencia',
  })
  @IsNotEmpty()
  @IsString()
  readonly codigo: string;
}
