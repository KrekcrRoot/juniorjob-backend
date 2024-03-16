import { IsNotEmpty, IsUUID } from "class-validator";

export class UuidProfessionalTrialDto {
  @IsUUID()
  @IsNotEmpty()
  uuid: string;
}