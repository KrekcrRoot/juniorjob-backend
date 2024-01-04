import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class VacancyResponseCreateDto {

  @IsString()
  @IsUUID()
  @IsNotEmpty()
  vacancy_uuid: string;

}