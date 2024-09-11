import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsMongoId, IsNotEmpty, IsNumber } from 'class-validator';
import { eventosDto } from './eventos.dto';

export class eventoDto {
  @ApiProperty({
    type: String,
    default: '64ff808815f852cb3ee45e4b',
    description: 'Instructor relacionado al registro de eventos',
  })
  @IsNotEmpty()
  @IsMongoId()
  readonly instructor: string;

  @ApiProperty({
    type: Array,
  })
  @IsNotEmpty()
  @IsArray()
  readonly eventos: eventosDto[];
}
