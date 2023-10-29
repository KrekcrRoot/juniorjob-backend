import { Controller, Get, HttpException, HttpStatus, Param } from '@nestjs/common';
import { CitiesService } from './cities.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { City } from './city.entity';
import { isUUID } from 'class-validator';

@ApiTags('Cities')
@Controller('cities')
export class CitiesController {
  constructor(private citiesService: CitiesService) {}

  @ApiResponse({
    status: 200,
    type: City,
    isArray: true,
    description: 'Return all cities with uuid',
  })
  @ApiOperation({ summary: 'Return all cities with uuid' })
  @Get()
  getAll(): Promise<City[]> {
    return this.citiesService.getAllCities();
  }

  @ApiResponse({
    status: 200,
    type: City,
    isArray: false,
    description: 'Return city by name',
  })
  @ApiOperation({ summary: 'Return city by name' })
  @Get('/name/:name')
  getByName(@Param() params: any): Promise<City | undefined> {
    if (params.name.trim() === '') {
      throw new HttpException('Not valid city name', HttpStatus.BAD_REQUEST);
    }
    return this.citiesService.getCityByName(params.name);
  }

  @ApiResponse({
    status: 200,
    type: City,
    isArray: false,
    description: 'Return city by uuid',
  })
  @ApiOperation({ summary: 'Return city by uuid' })
  @Get(':uuid')
  getById(@Param() params: any): Promise<City | undefined> {
    if (!isUUID(params.uuid)) {
      throw new HttpException('Not valid uuid', HttpStatus.BAD_REQUEST);
    }
    return this.citiesService.getCityById(params.uuid);
  }
}
