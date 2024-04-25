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
   numero: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  @Matches(/^(?!\s*$).+/, {
    message: 'El campo fecha de inicio no debe estar vacio',
  })
   fechaInicio:any;

  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  @Matches(/^(?!\s*$).+/, {
    message: 'El campo fecha de inicio no debe estar vacio',
  })
   fechaTerminacion: any;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  @Matches(/^(?!\s*$).+/, {
    message: 'El campo fecha de inicio no debe estar vacio',
  })
   tipoVinculacion: string;
}
