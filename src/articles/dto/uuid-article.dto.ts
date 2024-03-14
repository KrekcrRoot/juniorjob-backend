import { IsNotEmpty, IsUUID } from "class-validator";

export class UuidArticleDto {
  @IsUUID()
  @IsNotEmpty()
  uuid: string;
}