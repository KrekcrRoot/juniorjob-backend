import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { UserRole } from "../role.enum";
import { ApiProperty } from "@nestjs/swagger";

export class ChangeRoleDto {

  @ApiProperty({
    example: UserRole.Applicant,
    description: 'User role enum',
  })
  @IsNotEmpty()
  @IsEnum(UserRole)
  public role: UserRole;

}