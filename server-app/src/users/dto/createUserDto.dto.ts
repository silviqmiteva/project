import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @Length(8, 20)
  password: string;

  @IsEmail()
  email: string;

  // @IsNotEmpty()
  // @IsNumber()
  // role: number;

  // @IsString()
  // refresh_token: string;
}
