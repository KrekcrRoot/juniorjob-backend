import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { ProfessionalTrialsService } from "./professional-trials.service";
import { AllProfessionalTrialsDto } from "./dto/all-professional-trials.dto";
import { AccessTokenGuard } from "../common/guards/accessToken.guard";
import { Roles } from "../roles/roles.decorator";
import { UserRole } from "../roles/role.enum";
import { ProfessionalTrialsStoreDto } from "./dto/professional-trials-store.dto";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { TokenRequest } from "../users/dto/token-request";
import { ProfessionalTrial } from "./professional-trial.entity";
import { ProfessionalTrialCategory } from "./professional-trial-category.entity";
import { ProfessionalTrialCategoriesService } from "./professional-trial-categories.service";
import { ProfessionalTrialsUuidDto } from "./dto/professional-trials-uuid.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { FileTypeValidationPipe } from "../vacancies/vacancies.image.pipe";
import { uploadFile } from "../global/uploadFile";
import { join } from "path";
import constants from "../global/constants";
import { ConfigService } from "@nestjs/config";
import { StoreProfessionalCategoryDto } from "./dto/professional-category-store.dto";

@ApiTags('Professional trials')
@Controller('professional-trials')
export class ProfessionalTrialsController {

  constructor(
    private professionalService: ProfessionalTrialsService,
    private configService: ConfigService
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

  @UseGuards(AccessTokenGuard)
  @Roles(UserRole.Moderator)
  @UseInterceptors(FileInterceptor('image'))
  @ApiBearerAuth()
  @Post('/uploadImage')
  uploadImage(
    @UploadedFile(new FileTypeValidationPipe()) file: Express.Multer.File,
    @Body() professionalTrialsUuidDto: ProfessionalTrialsUuidDto,
  ) {
    const filePwd = uploadFile(file, join(this.configService.get<string>('STORAGE_FOLDER'), constants.professionalTrialsFolder));
    return this.professionalService.updateImage(professionalTrialsUuidDto, filePwd);
  }

  // Delete

  @ApiResponse({
    description: 'Delete respond to professional trial',
    status: HttpStatus.OK,
  })
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Delete('/respond')
  deleteRespond(@Req() tokenRequest: TokenRequest, @Body() professionalTrialUUID: ProfessionalTrialsUuidDto) {
    return this.professionalService.deleteRespond(professionalTrialUUID, tokenRequest.user.uuid);
  }

  @ApiResponse({
    description: 'Delete professional trial',
    status: HttpStatus.OK,
  })
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Roles(UserRole.Moderator)
  @Delete()
  deleteProfessionalTrial(@Body() professionalTrialUUID: ProfessionalTrialsUuidDto) {
    return this.professionalService.deleteProfessionalTrial(professionalTrialUUID);
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


  @ApiResponse({
    description: 'Store professional trial category (only for moderator)',
    type: ProfessionalTrialCategory,
  })
  @UseGuards(AccessTokenGuard)
  @Roles(UserRole.Moderator)
  @Post('/store')
  store(storeProfessionalCategory: StoreProfessionalCategoryDto) {
    return this.professionalTrialCategories.store(storeProfessionalCategory);
  }

}