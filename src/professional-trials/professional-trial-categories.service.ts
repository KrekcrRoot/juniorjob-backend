import { Injectable } from '@nestjs/common';
import { ProfessionalTrialCategory } from './professional-trial-category.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { StoreProfessionalCategoryDto } from './dto/professional-category-store.dto';


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

  async store(storeProfessionalCategory: StoreProfessionalCategoryDto) {
    const profTrialCategory = this.professionalTrialCategories.create({
      title: storeProfessionalCategory.title,
    });

    return this.professionalTrialCategories.save(profTrialCategory);
  }

}