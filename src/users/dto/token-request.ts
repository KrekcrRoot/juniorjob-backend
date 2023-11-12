import { UserJwtDto } from "./user-jwt.dto";

export interface TokenRequest extends Request {
  user: UserJwtDto;
}