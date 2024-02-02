import {
  Controller,
  Get,
  Param,
  Res,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { join } from 'path';
import type { Response } from 'express';
import constants from 'src/global/constants';
import { ConfigService } from '@nestjs/config';
import { StorageService } from './storage.service';

@ApiTags('Storage')
@Controller('storage')
export class StorageController {
  constructor(private configService: ConfigService, private storageService: StorageService) {}

  @ApiOperation({ summary: 'Return vacancy image from store' })
  @Get('/vacancies/:filename')
  getVacancyImage(
    @Param() params: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    const vacancyPath = join(
      this.configService.get<string>('STORAGE_FOLDER'),
      constants.vacanciesFolder,
    );

    return this.storageService.streamFile(join(vacancyPath, params.filename), res);
  }

  @Get('/users/:filename')
  getUsersImage(
    @Param() params: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    const usersPath = join(
      this.configService.get<string>('STORAGE_FOLDER'),
      constants.usersFolder,
    );

    return this.storageService.streamFile(join(usersPath, params.filename), res);
  }

  @Get('/vacanciesCategory/:filename')
  getVacancyCategoryImage(
    @Param() params: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    const categoryPath = join(
      this.configService.get<string>('STORAGE_FOLDER'),
      constants.vacanciesCategoryFolder,
    );

    return this.storageService.streamFile(join(categoryPath, params.filename), res);
  }

  @Get('/professionalTrial/:filename')
  getProfessionalTrialImage(
    @Param() params: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    const profPath = join(
      this.configService.get<string>('STORAGE_FOLDER'),
      constants.professionalTrialsFolder,
    );

    return this.storageService.streamFile(join(profPath, params.filename), res);
  }
}
