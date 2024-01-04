import { Module } from '@nestjs/common';
import { VacanciesController } from './vacancies.controller';
import { VacanciesService } from './vacancies.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vacancy } from './vacancy.entity';
import { VacancyCategory } from './vacancy-category.entity';
import { UsersModule } from 'src/users/users.module';
import { VacanciesCategories } from './vacancy.categories.controller';
import { VacancyCategoryService } from './vacancies.category.service';

@Module({
  imports: [TypeOrmModule.forFeature([Vacancy, VacancyCategory]), UsersModule],
  controllers: [VacanciesController, VacanciesCategories],
  providers: [VacanciesService, VacancyCategoryService],
  exports: [VacanciesService],
})
export class VacanciesModule {}
