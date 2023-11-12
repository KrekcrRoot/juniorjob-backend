import { ApiProperty } from "@nestjs/swagger";
import { UserRole } from "../role.enum";

export class ChangeRoleResponse {

  @ApiProperty({
    example: '6f609eb2-e377-4978-96d0-136f148b9828',
    description: 'UUID role of user',
  })
  public uuid: string;

  @ApiProperty({
    example: UserRole.Applicant,
    description: 'Current user role',
  })
  public current: UserRole;

}