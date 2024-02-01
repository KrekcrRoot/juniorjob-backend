import { Module } from '@nestjs/common';
import { ProfessionalTrialCategoriesController, ProfessionalTrialsController } from './professional-trials.controller';
import { ProfessionalTrialsService } from './professional-trials.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfessionalTrial } from './professional-trial.entity';
import { ProfessionalTrialCategory } from './professional-trial-category.entity';
import { ProfessionalTrialCategoriesService } from './professional-trial-categories.service';
import { User } from '../users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProfessionalTrial, ProfessionalTrialCategory, User])],
  controllers: [ProfessionalTrialsController, ProfessionalTrialCategoriesController],
  providers: [ProfessionalTrialsService, ProfessionalTrialCategoriesService]
})
export class ProfessionalTrialsModule {}
