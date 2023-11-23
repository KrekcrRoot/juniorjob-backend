import { UserRole } from "src/roles/role.enum";

export class UserJwtDto {

  public uuid: string;
  public email: string;
  public role: UserRole;

}