import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class StoreProfessionalCategoryDto {
  @MaxLength(256)
  @IsString()
  @IsNotEmpty()
  title: string;
}