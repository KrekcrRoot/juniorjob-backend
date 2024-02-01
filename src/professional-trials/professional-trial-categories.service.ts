import { Injectable } from '@nestjs/common';
import { ProfessionalTrialCategory } from './professional-trial-category.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';


@Injectable()
export class ProfessionalTrialCategoriesService {

  constructor(
    @InjectRepository(ProfessionalTrialCategory) private professionalTrialCategories: Repository<ProfessionalTrialCategory>
  ) {
  }

  async all() {
    return this.professionalTrialCategories.findBy({
      shadow: false,
    });
  }

}