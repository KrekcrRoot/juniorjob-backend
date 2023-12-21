import { BadRequestException, Controller, Get, Param, Res, StreamableFile } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import * as fs from 'fs';
import { join } from 'path';
import type { Response } from 'express';
import constants from 'src/global/constants';

@ApiTags('Storage')
@Controller('storage')
export class StorageController {

  @ApiOperation({ summary: 'Return vacancy image from store' })
  @Get('/vacancies/:filename')
  getVacancyImage(@Param() params: any, @Res({ passthrough: true }) res: Response) {

    const process_cwd = join(process.cwd(), '/..');
    const categoryPath = join(process_cwd, constants.vacanciesCategoryFolder);
    const vacancyPath = join(process_cwd, constants.vacanciesFolder);

    if(!fs.existsSync(join(vacancyPath, params.filename))) {
      throw new BadRequestException('File not exist');
    }

    const file = fs.createReadStream(join(vacancyPath, params.filename));

    const file_params = params.filename.split('.')

    if(file_params[file_params.length - 1] == 'png') {
      res.set({
        'Content-Type': 'image/png',
      })
    }else{
      res.set({
        'Content-Type': 'image/jpeg',
      })
    }

    return new StreamableFile(file);
  }

  @Get('/users/:filename')
  getUsersImage(@Param() params: any, @Res({ passthrough: true }) res: Response) {
    const process_cwd = join(process.cwd(), '/..');
    const categoryPath = join(process_cwd, constants.vacanciesCategoryFolder);
    const usersPath = join(process_cwd, constants.usersFolder);

    if(!fs.existsSync(join(usersPath, params.filename))) {
      throw new BadRequestException('File not exist');
    }

    const file = fs.createReadStream(join(usersPath, params.filename));
  
    const file_params = params.filename.split('.')

    if(file_params[file_params.length - 1] == 'png') {
      res.set({
        'Content-Type': 'image/png',
      })
    }else{
      res.set({
        'Content-Type': 'image/jpeg',
      })
    }

    return new StreamableFile(file);
  }

  @Get('/vacanciesCategory/:filename')
  getVacancyCategoryImage(@Param() params: any, @Res({ passthrough: true }) res: Response) {
    
    const process_cwd = join(process.cwd(), '/..');
    const categoryPath = join(process_cwd, constants.vacanciesCategoryFolder);

    if(!fs.existsSync(join(categoryPath, params.filename))) {
      throw new BadRequestException('File not exist');
    }

    const file = fs.createReadStream(join(categoryPath, params.filename));
  
    const file_params = params.filename.split('.')

    if(file_params[file_params.length - 1] == 'png') {
      res.set({
        'Content-Type': 'image/png',
      })
    }else{
      res.set({
        'Content-Type': 'image/jpeg',
      })
    }

    console.log(file);

    return new StreamableFile(file);
  }

}