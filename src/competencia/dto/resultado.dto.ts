import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, Matches } from 'class-validator';

export class resultadoDto {
  @ApiProperty({ type: String, default: 'Descripción del resultado' })
  @IsNotEmpty()
  @Matches(/^(?!\s*$).+/, {
    message: 'El codigo del programa no puede estar vacío',
  })
  readonly descripcion: string;

  @ApiProperty({ type: Number, default: 12 })
  @Matches(/^(?!\s*$).+/, { message: 'El nombre no puede estar vacío' })
  @IsNotEmpty()
  @IsNumber()
  readonly duracion: number;

  @ApiProperty({ type: Number, default: 1 })
  @Matches(/^(?!\s*$).+/, { message: 'El orden no puede estar vacío' })
  @IsNotEmpty()
  @IsOptional()
  readonly orden: number;
}
