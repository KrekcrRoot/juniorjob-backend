import { BadRequestException, Body, Controller, ForbiddenException, Get, HttpStatus, Param, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common'
import { VacancyCategoryService } from './vacancies.category.service';
import { ApiBearerAuth, ApiOperation, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength, isUUID } from 'class-validator';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/roles/roles.decorator';
import { UserRole } from 'src/roles/role.enum';
import { VacancyCategory } from './vacancy-category.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import constants from 'src/global/constants';
import responses from 'src/global/responses';
import { TokenRequest } from 'src/users/dto/token-request';
import { UUIDVacancyDto } from './dto/uuid-vacancy.dto';
import { FileTypeValidationPipe } from './vacancies.image.pipe';
import { UUIDVacancyCategoryDto } from './dto/uuid-vacancy-category.dto';
import * as fs from 'fs';

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

  constructor(private vacanciesCategoryService: VacancyCategoryService) {}

  @ApiResponse({
    status: HttpStatus.OK,
    type: VacancyCategory,
    isArray: true,
    description: 'All vacancy category'
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
    description: 'Store vacancy category (Moderator only)'
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
  async uploadFile(@Body() req: UUIDVacancyCategoryDto, @UploadedFile(new FileTypeValidationPipe()) file: Express.Multer.File) {
      const category = await this.vacanciesCategoryService.uuid(req.category_uuid);

      if(!category) {
          throw new BadRequestException(responses.doesntExistUUID('Category'));
      }

      const filearr = file.originalname.split('.');
      const type = filearr[filearr.length - 1];

      const fileName = constants.vacanciesCategoryFolder + Date.now() + '.' + type;
      fs.writeFileSync(__dirname + '/../..' + fileName, file.buffer);

      return this.vacanciesCategoryService.editImage(req.category_uuid, fileName);
  }

  @Get(':uuid')
  async getByUuid(@Param() params: any) {
    if(!isUUID(params.uuid)) {
      throw new BadRequestException(responses.uuidNotValid);
    }

    return this.vacanciesCategoryService.uuid(params.uuid);
  }

}