import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { UserRole } from './role.enum';
import { ROLES_KEY } from './roles.decorator';
import { UserJwtDto } from 'src/users/dto/user-jwt.dto';

interface tokenRequest extends Request {
  user: UserJwtDto;
}


@Injectable()
export class RolesGuard implements CanActivate {

  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if(!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest() as tokenRequest;
    return requiredRoles.some((role) => user.role == role);
  }
}
