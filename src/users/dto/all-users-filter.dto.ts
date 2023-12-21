import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDateString, IsEnum, IsInt, IsNumber, IsOptional } from "class-validator";

export enum SortDirection {
  UP = 'Up',
  DOWN = 'Down',
}

export class AllFilterDto {
  
  @ApiProperty({
    required: false,
    example: '0',
    description: 'Page number'
  })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  page: number;

  @ApiProperty({
    required: false,
    example: '30',
    description: 'Lists in one page'
  })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  row: number | null;

  @ApiProperty({
    required: false,
    example: '12',
    description: 'Find by date'
  })
  @IsOptional()
  @IsDateString()
  byDate: Date;

  @ApiProperty({
    required: false,
    example: '12',
    description: 'Sort by created at (Up, Down)'
  })
  @IsOptional()
  @IsEnum(SortDirection)
  sortByUpdatedAt: SortDirection;

  @ApiProperty({
    required: false,
    example: '12',
    description: 'Sort by updated at (Up, Down)'
  })
  @IsOptional()
  @IsEnum(SortDirection)
  sortByCreatedAt: SortDirection;

}