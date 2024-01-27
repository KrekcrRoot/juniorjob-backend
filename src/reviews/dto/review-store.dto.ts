import { IsEnum, IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';
import { MarkEnum } from '../review.entity';
import { ApiProperty } from '@nestjs/swagger';

export class ReviewStoreDto {

  @ApiProperty({
    example: 5,
    description: 'Mark from -1 to 5 included',
  })
  @IsEnum(MarkEnum)
  @IsNotEmpty()
  mark: MarkEnum;

  @ApiProperty({
    example: 'Lorem ipsum',
    description: 'Review body',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1024)
  body: string;

}