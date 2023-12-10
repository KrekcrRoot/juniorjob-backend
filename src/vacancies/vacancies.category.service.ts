import { Injectable } from '@nestjs/common'
import { VacancyCategory } from './vacancy-category.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { VacancyCategoryDto } from './vacancy.categories.controller';

@Injectable()
export class VacancyCategoryService {

  constructor(@InjectRepository(VacancyCategory) private vacancyCategoryRepository: Repository<VacancyCategory>) {}

  async all(): Promise<Array<VacancyCategory>> {
    return this.vacancyCategoryRepository.find();
  }

  async store(vacancyCategoryDto: VacancyCategoryDto): Promise<VacancyCategory> {
    const vacancyCategory = this.vacancyCategoryRepository.create({
      ...vacancyCategoryDto,
    });

    return this.vacancyCategoryRepository.save(vacancyCategory);
  }

}