import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginAuthDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    example: 'mail@gmail.com',
    description: 'Email for login',
  })
  public email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @ApiProperty({
    example: '64dfb04e',
    description: 'Password for login',
  })
  public password: string;
}
