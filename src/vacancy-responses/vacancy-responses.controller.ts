import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { VacancyResponsesService } from './vacancy-responses.service';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/roles/roles.decorator';
import { UserRole } from 'src/roles/role.enum';
import { TokenRequest } from 'src/users/dto/token-request';
import { UUIDVacancyDto } from 'src/vacancies/dto/uuid-vacancy.dto';
import { UserUUID } from 'src/users/dto/user-uuid.dto';
import {
  ApiBearerAuth,
  ApiOperation, ApiProperty,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { VacancyResponse } from './vacancy-response.entity';
import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';

export class VacancyResponseCreateDto extends UUIDVacancyDto {
  @ApiProperty({
    example: 'Lorem ipsum se dolor',
    description: 'Vacancy response message',
  })
  @MaxLength(1024)
  @IsString()
  @IsNotEmpty()
  message: string;
}

@ApiTags('Vacancy responses')
@Controller('vacancies/response')
export class VacancyResponsesController {
  constructor(private vacancyResponseService: VacancyResponsesService) {}

  @ApiResponse({
    status: HttpStatus.OK,
    type: VacancyResponse,
    description: 'Create response to vacancy',
  })
  @ApiBearerAuth()
  @Post('/create')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(UserRole.Applicant, UserRole.Moderator)
  respond(@Body() vacancyCreate: VacancyResponseCreateDto, @Req() tokens: TokenRequest) {
    return this.vacancyResponseService.respond(vacancyCreate, tokens.user.uuid);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: VacancyResponse,
    isArray: true,
    description: 'All responses (ONLY FOR TEST)',
  })
  @ApiOperation({ summary: 'do not use in production!' })
  @ApiBearerAuth()
  @Get('/all')
  all() {
    return this.vacancyResponseService.all();
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: VacancyResponse,
    isArray: true,
    description: 'Get all responses by applicant',
  })
  @Get('/applicant/:uuid')
  findAllApplicant(@Param() applicant: UserUUID) {
    return this.vacancyResponseService.findAllByApplicant(applicant.uuid);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: VacancyResponse,
    isArray: true,
    description: 'Get all responses to employer',
  })
  @Get('/employer/:uuid')
  findAllEmployer(@Param() employer: UserUUID) {
    return this.vacancyResponseService.findAllByEmployer(employer.uuid);
  }
  @ApiResponse({
    status: HttpStatus.OK,
    type: VacancyResponse,
    isArray: true,
    description: 'Get all responses by vacancy',
  })
  @Get('/vacancy/:uuid')
  findAllVacancy(@Param() vacancy: UUIDVacancyDto) {
    return this.vacancyResponseService.findAllByVacancy(vacancy.uuid);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: VacancyResponse,
    description: 'Get response by uuid',
  })
  @Get('/:uuid')
  findByUUID(@Param() vacancyUUID: UUIDVacancyDto) {
    return this.vacancyResponseService.findByUUID(vacancyUUID.uuid);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: VacancyResponse,
    description: 'Delete response by uuid',
  })
  @Delete('/:uuid')
  delete(@Param() vacancyUUID: UUIDVacancyDto) {
    return this.vacancyResponseService.deleteByUUID(vacancyUUID.uuid);
  }
}
