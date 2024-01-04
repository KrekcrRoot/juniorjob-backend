import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import * as fs from 'fs';
import { join } from 'path';
import type { Response } from 'express';
import constants from 'src/global/constants';
import { ConfigService } from '@nestjs/config';

@ApiTags('Storage')
@Controller('storage')
export class StorageController {
  constructor(private configService: ConfigService) {}

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

    if (!fs.existsSync(join(vacancyPath, params.filename))) {
      throw new BadRequestException('File not exist');
    }

    const file = fs.createReadStream(join(vacancyPath, params.filename));
    const file_params = params.filename.split('.');

    if (file_params[file_params.length - 1] == 'png') {
      res.set({
        'Content-Type': 'image/png',
      });
    } else {
      res.set({
        'Content-Type': 'image/jpeg',
      });
    }

    return new StreamableFile(file);
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

    if (!fs.existsSync(join(usersPath, params.filename))) {
      throw new BadRequestException('File not exist');
    }

    const file = fs.createReadStream(join(usersPath, params.filename));
    const file_params = params.filename.split('.');

    if (file_params[file_params.length - 1] == 'png') {
      res.set({
        'Content-Type': 'image/png',
      });
    } else {
      res.set({
        'Content-Type': 'image/jpeg',
      });
    }

    return new StreamableFile(file);
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

    if (!fs.existsSync(join(categoryPath, params.filename))) {
      throw new BadRequestException('File not exist');
    }

    const file = fs.createReadStream(join(categoryPath, params.filename));
    const file_params = params.filename.split('.');

    if (file_params[file_params.length - 1] == 'png') {
      res.set({
        'Content-Type': 'image/png',
      });
    } else {
      res.set({
        'Content-Type': 'image/jpeg',
      });
    }

    return new StreamableFile(file);
  }
}
