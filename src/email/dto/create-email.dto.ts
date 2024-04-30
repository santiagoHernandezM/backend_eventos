import { IsEmail, IsString, isEmail } from 'class-validator';

export class CreateEmailDto {
  @IsString()
  @IsEmail()
  email: string;
}
