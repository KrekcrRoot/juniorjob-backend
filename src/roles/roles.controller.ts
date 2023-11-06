import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { UserJwtDto } from 'src/users/dto/user-jwt.dto';
import { ApiTags } from '@nestjs/swagger';

interface tokenRequest extends Request {
  user: UserJwtDto;
}

@ApiTags('Roles')
@Controller('roles')
export class RolesController {

  constructor(private rolesService: RolesService) {}

  @Get('/user/:uuid')
  findUserRole(@Param() params: any) {
    return this.rolesService.findUserRole(params.uuid);
  }
  
  @UseGuards(AccessTokenGuard)
  @Get('/my')
  findByToken(@Req() req: tokenRequest) {
    return this.rolesService.findUserRole(req.user.uuid);
  }

  @Get('/applicant/:uuid')
  findApplicant(@Param() params: any) {
    return this.rolesService.findApplicant(params.uuid);
  }

  @Get('/individual/:uuid')
  findIndividual(@Param() params: any) {
    return this.rolesService.findIndividual(params.uuid);
  }

  @Get('/legal-entity/:uuid')
  findLegalEntity(@Param() params: any) {
    return this.rolesService.findLegalEntity(params.uuid);
  }

  @Get('/moderator/:uuid')
  findModerator(@Param() params: any) {
    return this.rolesService.findModerator(params.uuid);
  }

  @Get(':uuid')
  findRole(@Param() params: any) {
    return this.rolesService.findRole(params.uuid);
  }



}
