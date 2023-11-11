import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class IndividualUpdateDto {

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'name',
    description: 'Individual name',
  })
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'surname',
    description: 'Individual surname',
  })
  surname: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'patronymic',
    description: 'Individual patronymic'
  })
  patronymic: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '{some json}',
    description: 'Individual summary',
  })
  summary: string;

}