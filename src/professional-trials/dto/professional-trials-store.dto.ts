import { IsDateString, IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProfessionalTrialsStoreDto {

  @ApiProperty({
    example: 'b75fe173-1e59-49ef-9527-ca2fd02bd75c',
    description: 'Category uuid of professional trial',
  })
  @IsUUID()
  @IsString()
  category_uuid: string;

  @ApiProperty({
    example: 'Some title',
    description: 'Title of professional trial',
  })
  @MaxLength(256)
  @IsString()
  title: string;

  @ApiProperty({
    example: 'Ulitsa pushkina, dom kolotushkina',
    description: 'Street or place of professional trial',
  })
  @MaxLength(256)
  @IsString()
  place: string;

  @ApiProperty({
    example: '14:00 to 18:00',
    description: 'Time of professional trial',
  })
  @IsString()
  @IsNotEmpty()
  time: string;

  @ApiProperty({
    example: '2024-02-01T18:54:05.452Z',
    description: 'Date of professional trial',
  })
  @IsDateString()
  date: Date;


}