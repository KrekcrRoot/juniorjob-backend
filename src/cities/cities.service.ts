import { Injectable, OnModuleInit } from '@nestjs/common';
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

  async getCityByUUID(uuid: string): Promise<City | undefined> {
    return await this.citiesRepository.findOne({ where: { uuid: uuid } });
  }

  async getCityByName(name: string): Promise<City | undefined> {
    return await this.citiesRepository.findOne({ where: { title: name } });
  }

  async storeCity(name: string): Promise<City | null> {
    const city = this.citiesRepository.create({
      title: name,
    })

    return this.citiesRepository.save(city);
  }
}
