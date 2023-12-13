import { BadRequestException, Injectable } from '@nestjs/common'
import { VacancyCategory } from './vacancy-category.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { VacancyCategoryDto } from './vacancy.categories.controller';
import responses from 'src/global/responses';

@Injectable()
export class VacancyCategoryService {

  constructor(@InjectRepository(VacancyCategory) private vacancyCategoryRepository: Repository<VacancyCategory>) {}

  async all(): Promise<Array<VacancyCategory>> {
    return this.vacancyCategoryRepository.find();
  }

  async uuid(uuid: string) {
    return this.vacancyCategoryRepository.findOneBy({
      uuid: uuid,
    });
  }

  async editImage(uuid: string, filename: string) {
    let category = await this.vacancyCategoryRepository.findOneBy({
      uuid: uuid,
    });

    if(!category) {
      throw new BadRequestException(responses.doesntExistUUID('Vacancy category'));
    }

    category.image = filename;
    return this.vacancyCategoryRepository.save(category);
  }

  async store(vacancyCategoryDto: VacancyCategoryDto): Promise<VacancyCategory> {
    const vacancyCategory = this.vacancyCategoryRepository.create({
      ...vacancyCategoryDto,
    });

    return this.vacancyCategoryRepository.save(vacancyCategory);
  }

}