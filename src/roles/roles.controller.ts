import { Controller, Get, HttpStatus, Param, Req, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { UserJwtDto } from 'src/users/dto/user-jwt.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role } from './role.entity';
import { Applicant } from './models/applicant-role.entity';
import { Individual } from './models/individual-role.entity';
import { LegalEntity } from './models/legal-role.entity';
import { Moderator } from './models/moderator-role.entity';

interface tokenRequest extends Request {
  user: UserJwtDto;
}

@ApiTags('Roles')
@Controller('roles')
export class RolesController {

  constructor(private rolesService: RolesService) {}

  @ApiResponse({
    status: HttpStatus.OK,
    type: Role,
    description: 'Return role by user uuid',
  })
  @ApiOperation({ summary: 'Return role by user uuid' })
  @Get('/user/:uuid')
  findUserRole(@Param() params: any) {
    return this.rolesService.findUserRole(params.uuid);
  }
  
  @ApiResponse({
    status: HttpStatus.OK,
    type: Role,
    description: 'Return role by token',
  })
  @ApiOperation({ summary: 'Return role by token' })
  @UseGuards(AccessTokenGuard)
  @Get('/my')
  findByToken(@Req() req: tokenRequest) {
    return this.rolesService.findUserRole(req.user.uuid);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: Applicant,
    description: 'Return applicant by uuid',
  })
  @ApiOperation({ summary: 'Return applicant by uuid' })
  @Get('/applicant/:uuid')
  findApplicant(@Param() params: any) {
    return this.rolesService.findApplicant(params.uuid);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: Individual,
    description: 'Return individual by uuid',
  })
  @ApiOperation({ summary: 'Return individual by uuid' })
  @Get('/individual/:uuid')
  findIndividual(@Param() params: any) {
    return this.rolesService.findIndividual(params.uuid);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: LegalEntity,
    description: 'Return legal entity by uuid',
  })
  @ApiOperation({ summary: 'Return legal entity by uuid' })
  @Get('/legal-entity/:uuid')
  findLegalEntity(@Param() params: any) {
    return this.rolesService.findLegalEntity(params.uuid);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: Moderator,
    description: 'Return moderator by uuid',
  })
  @ApiOperation({ summary: 'Return moderator by uuid' })
  @Get('/moderator/:uuid')
  findModerator(@Param() params: any) {
    return this.rolesService.findModerator(params.uuid);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: Role,
    description: 'Return role by uuid',
  })
  @ApiOperation({ summary: 'Return role by uuid' })
  @Get(':uuid')
  findRole(@Param() params: any) {
    return this.rolesService.findRole(params.uuid);
  }
}
