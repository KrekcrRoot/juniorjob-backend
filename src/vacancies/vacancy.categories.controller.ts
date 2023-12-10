import { Body, Controller, Get, HttpStatus, Post, UseGuards } from '@nestjs/common'
import { VacancyCategoryService } from './vacancies.category.service';
import { ApiBearerAuth, ApiOperation, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/roles/roles.decorator';
import { UserRole } from 'src/roles/role.enum';
import { VacancyCategory } from './vacancy-category.entity';

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

}