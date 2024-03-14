import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class StoreArticleDto {

  @IsString()
  @IsNotEmpty()
  @MaxLength(128)
  title: string;

  @IsString()
  @IsNotEmpty()
  body: string;

}