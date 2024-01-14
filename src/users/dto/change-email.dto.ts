import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChangeEmailDto {
  @ApiProperty({
    example: 'new@bk.ru',
    description: 'New email',
  })
  @IsEmail()
  @MinLength(5)
  @IsNotEmpty()
  public email: string;

  @ApiProperty({
    example: '54321',
    description: 'Password verification',
  })
  @IsString()
  @MinLength(5)
  @IsNotEmpty()
  public password: string;
}
