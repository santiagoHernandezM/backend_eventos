import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class NewPasswordDto {
  @IsNotEmpty()
  @IsString()
  @Length(6, 50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'newPassword must contain uppercase, lowercase and numbers',
  })
  readonly newPassword: string;
}
