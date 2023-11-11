import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty, IsString } from "class-validator";

export class ApplicantUpdateDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'Name',
    description: 'name for applicant'
  })
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'Surname',
    description: 'Surname for applicant',
  })
  surname: string;

  @IsDateString()
  @ApiProperty({
    example: new Date(),
    description: 'Birthday of applicant',
  })
  birthday: Date;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'Study place',
    description: 'Study place of applicant',
  })
  study_place: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '6234573345',
    description: 'Taxpayer identification number',
  })
  inn: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '[\'coding\']',
    description: 'Comptetitions in JSON array',
  })
  competitions: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '{some json}',
    description: 'Summary of applicant in JSON'
  })
  summary: string;

  @ApiProperty({
    example: new Date(),
    description: 'Created at',
  })
  created_at: Date;

  @ApiProperty({
    example: new Date(),
    description: 'Updated at',
  })
  updated_at: Date;
}