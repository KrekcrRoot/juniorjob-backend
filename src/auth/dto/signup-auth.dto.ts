import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, IsUUID, MinLength } from "class-validator";

export class SignUpAuthDto {
  @ApiProperty({
    example: 'mail@gmail.com',
    description: 'User email',
  })
  @IsNotEmpty()
  @IsEmail()
  public email: string;

  @ApiProperty({
    example: '64dfb04e',
    description: 'User password',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  public password: string;

  @ApiProperty({
    example: 'City uuid',
    description: '3ee4b642-531c-4575-a840-0f6ee99110af',
  })
  @IsNotEmpty()
  @IsUUID('4')
  public city_uuid: string;
}