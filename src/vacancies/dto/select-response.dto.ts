import { IsString, IsUUID } from 'class-validator';

export class SelectResponseDto {
  @IsUUID()
  @IsString()
  vacancy_response: string;
}