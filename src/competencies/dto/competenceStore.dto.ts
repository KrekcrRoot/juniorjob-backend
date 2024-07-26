import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CompetenceStoreDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Компетенция',
    description: 'Title of competence',
  })
  title: string;
}
