import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { VacancyCategoryService } from './vacancies.category.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { IsString, MaxLength, MinLength, isUUID } from 'class-validator';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/roles/roles.decorator';
import { UserRole } from 'src/roles/role.enum';
import { VacancyCategory } from './vacancy-category.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import responses from 'src/global/responses';
import { FileTypeValidationPipe } from './vacancies.image.pipe';
import { UUIDVacancyCategoryDto } from './dto/uuid-vacancy-category.dto';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import constants from '../global/constants';

export class VacancyCategoryDto {
  @ApiProperty({
    example: 'Coding',
    description: 'Vacancy category title',
  })
  @IsString()
  @MinLength(5)
  @MaxLength(256)
  title: string;
}

@ApiTags('Vacancy categories')
@Controller('vacancies/category')
export class VacanciesCategories {
  constructor(
    private vacanciesCategoryService: VacancyCategoryService,
    private configService: ConfigService,
  ) {}

  @ApiResponse({
    status: HttpStatus.OK,
    type: VacancyCategory,
    isArray: true,
    description: 'All vacancy category',
  })
  @ApiOperation({ summary: 'Store vacancy category (Moderator only)' })
  @Get('/all')
  all() {
    return this.vacanciesCategoryService.all();
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: VacancyCategory,
    isArray: false,
    description: 'Store vacancy category (Moderator only)',
  })
  @ApiOperation({ summary: 'Store vacancy category (Moderator only)' })
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(UserRole.Moderator)
  @Post('/store')
  store(@Body() req: VacancyCategoryDto) {
    return this.vacanciesCategoryService.store(req);
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(UserRole.Moderator)
  @Post('/uploadImage')
  @UseInterceptors(FileInterceptor('image'))
  async uploadFile(
    @Body() req: UUIDVacancyCategoryDto,
    @UploadedFile(new FileTypeValidationPipe()) file: Express.Multer.File,
  ) {
    const category = await this.vacanciesCategoryService.uuid(
      req.category_uuid,
    );

    if (!category) {
      throw new BadRequestException(responses.doesntExistUUID('Category'));
    }

    const filearr = file.originalname.split('.');
    const type = filearr[filearr.length - 1];

    const fileRaw = Date.now() + '.' + type;
    const fileName = join(
      this.configService.get<string>('STORAGE_FOLDER'),
      constants.vacanciesCategoryFolder,
      fileRaw,
    );
    fs.writeFileSync(fileName, file.buffer);

    return this.vacanciesCategoryService.editImage(req.category_uuid, fileRaw);
  }

  @Get(':uuid')
  async getByUuid(@Param() params: any) {
    if (!isUUID(params.uuid)) {
      throw new BadRequestException(responses.uuidNotValid);
    }

    return this.vacanciesCategoryService.uuid(params.uuid);
  }
}
