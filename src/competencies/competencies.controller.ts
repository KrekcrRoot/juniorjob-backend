import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CompetenciesService } from './competencies.service';
import { ApiTags } from '@nestjs/swagger';
import { CompetenceStoreDto } from './dto/competenceStore.dto';
import { AccessTokenGuard } from '../common/guards/accessToken.guard';
import { Roles } from '../roles/roles.decorator';
import { UserRole } from '../roles/role.enum';
import { RolesGuard } from '../roles/roles.guard';

@ApiTags('Competencies')
@Controller('competencies')
export class CompetenciesController {

  constructor(private competenciesService: CompetenciesService) {}

  @Get('/all')
  getAll() {
    return this.competenciesService.findAll();
  }

  @Get('/byTitle/:title')
  getByTitle(@Param() params: {title: string}) {
    return this.competenciesService.findByTitle(params.title);
  }

  @Get('/:uuid')
  getByUuid(@Param() params: {uuid: string}) {
    return this.competenciesService.findByUuid(params.uuid);
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(UserRole.Moderator)
  @Delete('/:uuid')
  deleteByUuid(@Param() params: {uuid: string}) {
    return this.competenciesService.deleteByUuid(params.uuid);
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(UserRole.Moderator)
  @Post('/store')
  storeCompetence(@Body() competenceStoreDto: CompetenceStoreDto) {
    return this.competenciesService.store(competenceStoreDto);
  }

}
