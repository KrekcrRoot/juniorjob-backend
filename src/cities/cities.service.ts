import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { City } from './city.entity';

@Injectable()
export class CitiesService {
  constructor(
    @InjectRepository(City) private citiesRepository: Repository<City>,
  ) {}

  async getAllCities(): Promise<City[]> {
    return await this.citiesRepository.find();
  }
}
