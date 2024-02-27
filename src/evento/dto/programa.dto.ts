import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class programaDto {
  @ApiProperty({
    type: String,
    default: 'Análisis y Desarrollo de Sistemas',
    description: 'Nombre del programa',
  })
  @IsNotEmpty()
  @IsString()
  readonly nombre: string;

  @ApiProperty({
    type: String,
    default: '64ff7eef15f852cb3ee45e33',
    description: 'Mongo Id del programa',
  })
  @IsNotEmpty()
  @IsMongoId()
  readonly id: string;
}
