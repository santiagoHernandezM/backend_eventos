import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class fichaDto {
  @ApiProperty({
    type: String,
    default: '64ff81a915f852cb3ee45e57',
    description: 'Mongo Id de la ficha',
  })
  @IsNotEmpty()
  @IsMongoId()
  readonly ficha: string;

  @ApiProperty({
    type: String,
    default: '2617684',
    description: 'Código de la ficha',
  })
  @IsNotEmpty()
  @IsString()
  readonly codigo: string;
}
