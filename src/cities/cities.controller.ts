import { Controller, Get } from '@nestjs/common';
import { CitiesService } from './cities.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { City } from './city.entity';

@ApiTags('Города')
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
}
