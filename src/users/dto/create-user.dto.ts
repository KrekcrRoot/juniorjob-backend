import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { City } from '../../cities/city.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    example: 'email@gmail.com',
    description: 'Email',
  })
  public email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @ApiProperty({
    example: '64dfb04e',
    description: 'Password (min 5 length)',
  })
  public password: string;

  @IsNotEmpty()
  @ApiProperty({
    example: City,
    description: 'City uuid',
  })
  public city: City;
}
