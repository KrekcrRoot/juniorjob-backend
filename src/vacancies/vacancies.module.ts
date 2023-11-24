import { Module } from '@nestjs/common';
import { VacanciesController } from './vacancies.controller';
import { VacanciesService } from './vacancies.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vacancy } from './vacancy.entity';
import { VacancyCategory } from './vacancy-category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vacancy, VacancyCategory])],
  controllers: [VacanciesController],
  providers: [VacanciesService]
})
export class VacanciesModule {}
