import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class ambienteDto {
  @ApiProperty({
    type: String,
    default: '64b8758c87f48f29f890a0e7',
    description: 'Mongo Id del ambiente',
  })
  @IsNotEmpty()
  @IsMongoId()
  readonly id: string;

  @ApiProperty({
    type: String,
    default: 'C-201',
    description: 'Nomenclatura del ambiente',
  })
  @IsNotEmpty()
  @IsString()
  readonly ambiente: string;
}
