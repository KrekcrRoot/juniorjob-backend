import { IsNotEmpty, IsString, MaxLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class StoreArticleDto {

  @ApiProperty({
    example: 'Lorem ipsum',
    description: 'Title of article'
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(128)
  title: string;

  @ApiProperty({
    example: 'A lot of body',
    description: 'Body of article'
  })
  @IsString()
  @IsNotEmpty()
  body: string;

}