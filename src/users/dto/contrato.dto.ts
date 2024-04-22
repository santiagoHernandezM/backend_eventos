import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Matches,
  IsNumber,
  IsMongoId,
  IsDate,
} from 'class-validator';

export class ContratoDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Matches(/^(?!\s*$).+/, {
    message: 'El campo numero no debe estar vacio',
  })
  readonly numero: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  @Matches(/^(?!\s*$).+/, {
    message: 'El campo fecha de inicio no debe estar vacio',
  })
  readonly fechaInicio: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  @Matches(/^(?!\s*$).+/, {
    message: 'El campo fecha de inicio no debe estar vacio',
  })
  readonly fechaTerminacion: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  @Matches(/^(?!\s*$).+/, {
    message: 'El campo fecha de inicio no debe estar vacio',
  })
  readonly tipoVinculacion: string;
}
