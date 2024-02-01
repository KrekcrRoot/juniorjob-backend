import { Body, Controller, Delete, Get, HttpStatus, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ProfessionalTrialsService } from './professional-trials.service';
import { AllProfessionalTrialsDto } from './dto/all-professional-trials.dto';
import { AccessTokenGuard } from '../common/guards/accessToken.guard';
import { Roles } from '../roles/roles.decorator';
import { UserRole } from '../roles/role.enum';
import { ProfessionalTrialsStoreDto } from './dto/professional-trials-store.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TokenRequest } from '../users/dto/token-request';
import { ProfessionalTrial } from './professional-trial.entity';
import { ProfessionalTrialCategory } from './professional-trial-category.entity';
import { ProfessionalTrialCategoriesService } from './professional-trial-categories.service';
import { ProfessionalTrialsUuidDto } from './dto/professional-trials-uuid.dto';

@ApiTags('Professional trials')
@Controller('professional-trials')
export class ProfessionalTrialsController {

  constructor(
    private professionalService: ProfessionalTrialsService,
  ) {}

  // Get

  @ApiResponse({
    description: 'All professional trials',
    type: ProfessionalTrial,
    isArray: true,
  })
  @Get('/all')
  getAll(@Query() allFilters: AllProfessionalTrialsDto) {
    return this.professionalService.all(allFilters);
  }

  @ApiResponse({
    description: 'All my professional trials',
    type: ProfessionalTrial,
    isArray: true,
  })
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Get('/my')
  getMy(@Req() tokenRequest: TokenRequest) {
    return this.professionalService.byUser(tokenRequest.user.uuid);
  }

  // Post

  @ApiResponse({
    description: 'Store professional trial',
    type: ProfessionalTrial,
  })
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Roles(UserRole.Moderator)
  @Post('/store')
  store(@Body() professionalTrialsDto: ProfessionalTrialsStoreDto) {
    return this.professionalService.store(professionalTrialsDto);
  }

  @ApiResponse({
    description: 'Respond to professional trial',
    status: HttpStatus.CREATED,
  })
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Post('/respond')
  respond(@Req() tokenRequest: TokenRequest, @Body() professionalTrialUUID: ProfessionalTrialsUuidDto) {
    return this.professionalService.respond(professionalTrialUUID, tokenRequest.user.uuid);
  }

  // Delete

  @ApiResponse({
    description: 'Delete respond to professional trial',
    status: HttpStatus.OK,
  })
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Delete()
  deleteRespond(@Req() tokenRequest: TokenRequest, @Body() professionalTrialUUID: ProfessionalTrialsUuidDto) {
    return this.professionalService.deleteRespond(professionalTrialUUID, tokenRequest.user.uuid);
  }

}

@ApiTags('Professional trial categories')
@Controller('professional-trial-categories')
export class ProfessionalTrialCategoriesController {

  constructor(private professionalTrialCategories: ProfessionalTrialCategoriesService) {
  }

  @ApiResponse({
    description: 'Return all professional trial categories',
    type: ProfessionalTrialCategory,
    isArray: true,
  })
  @Get('/all')
  all() {
    return this.professionalTrialCategories.all();
  }

}