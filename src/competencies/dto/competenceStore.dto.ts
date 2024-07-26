import { IsNotEmpty, IsString } from 'class-validator';

export class CompetenceStoreDto {
  @IsString()
  @IsNotEmpty()
  title: string;
}