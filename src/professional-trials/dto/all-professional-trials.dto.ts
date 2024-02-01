import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class AllProfessionalTrialsDto {

  @ApiProperty({
    example: 'Some query',
    description: 'Query for search'
  })
  @IsString()
  @IsOptional()
  query: string;

  @ApiProperty({
    required: false,
    example: '20',
    description: 'Row number'
  })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  row: number;

  @ApiProperty({
    required: false,
    example: '0',
    description: 'Page number'
  })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  page: number;

}