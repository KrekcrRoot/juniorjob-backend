import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class StoreProfessionalCategoryDto {
  @ApiProperty({
    example: 'Some title',
    description: 'Title of professional trial category',
  })
  @MaxLength(256)
  @IsString()
  @IsNotEmpty()
  title: string;
}