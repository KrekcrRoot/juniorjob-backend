import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CompetenciesService } from './competencies.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CompetenceStoreDto } from './dto/competenceStore.dto';
import { AccessTokenGuard } from '../common/guards/accessToken.guard';
import { Roles } from '../roles/roles.decorator';
import { UserRole } from '../roles/role.enum';
import { RolesGuard } from '../roles/roles.guard';
import { Competence } from './competence.entity';
import { DeleteResult } from 'typeorm';

@ApiTags('Competencies')
@Controller('competencies')
export class CompetenciesController {
  constructor(private competenciesService: CompetenciesService) {}

  @ApiResponse({
    status: HttpStatus.OK,
    type: Competence,
    isArray: true,
    description: 'Get all competencies',
  })
  @ApiOperation({ summary: 'Get all competencies' })
  @Get('/all')
  getAll() {
    return this.competenciesService.findAll();
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: Competence,
    description: 'Get competence by title',
  })
  @ApiOperation({ summary: 'Get competence by title' })
  @Get('/byTitle/:title')
  getByTitle(@Param() params: { title: string }) {
    return this.competenciesService.findByTitle(params.title);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: Competence,
    description: 'Get competence by uuid',
  })
  @ApiOperation({ summary: 'Get competence by uuid' })
  @Get('/:uuid')
  getByUuid(@Param() params: { uuid: string }) {
    return this.competenciesService.findByUuid(params.uuid);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: DeleteResult,
    description: 'Delete competence',
  })
  @ApiOperation({ summary: 'Delete competence' })
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(UserRole.Moderator)
  @Delete('/:uuid')
  deleteByUuid(@Param() params: { uuid: string }) {
    return this.competenciesService.deleteByUuid(params.uuid);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: Competence,
    description: 'Create competence',
  })
  @ApiOperation({ summary: 'Create competence' })
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(UserRole.Moderator)
  @Post('/store')
  storeCompetence(@Body() competenceStoreDto: CompetenceStoreDto) {
    return this.competenciesService.store(competenceStoreDto);
  }
}
