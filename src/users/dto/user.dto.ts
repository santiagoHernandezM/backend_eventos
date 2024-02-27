import {
  IsNotEmpty,
  Length,
  IsString,
  Matches,
  IsEmail,
  IsArray,
  IsOptional,
  ArrayNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ContratoDto } from './contrato.dto';

export class UserDto {
  @ApiProperty()
  @Matches(/^(?!\s*$).+/, { message: 'El documento no puede ser estar vacío' })
  readonly documento: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Matches(/^(?!\s*$).+/, { message: 'El nombre no puede ser estar vacío' })
  readonly nombre: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Matches(/^(?!\s*$).+/, { message: 'El apellido no puede ser estar vacío' })
  readonly apellido: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  @Matches(/^(?!\s*$).+/, { message: 'El correo no puede ser estar vacío' })
  readonly correo: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Matches(/^(?!\s*$).+/, { message: 'El celular no puede ser estar vacío' })
  readonly celular: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly contrato: ContratoDto;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  readonly programas: string[];

  @ApiProperty()
  @Matches(/^(?!\s*$).+/, { message: 'El centro no puede estar vacía' })
  readonly centro: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  @Length(6, 50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'La contraseña debe contener Mayusculas, minusculas y numeros',
  })
  readonly password: string;

  @IsArray()
  @ApiProperty()
  @ArrayNotEmpty({ each: false })
  readonly roles: string[];
}

export class UserLoginDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  @Matches(/^(?!\s*$).+/, { message: 'El correo no puede ser estar vacío' })
  readonly correo: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  @Length(6, 50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'La contraseña debe contener Mayusculas, minusculas y numeros',
  })
  readonly password: string;
}
