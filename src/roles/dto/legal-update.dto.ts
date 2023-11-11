import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class LegalEntityUpdateDto {

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'title',
    description: 'Legal entity company title',
  })
  title: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '358822022749',
    description: 'Legal entity inn',
  })
  inn: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'contact info',
    description: 'Legal entity contact info',
  })
  contact_info: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '{some json}',
    description: 'Legal entity summary',
  })
  summary: string;

}