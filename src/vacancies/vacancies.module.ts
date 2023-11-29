import { Module } from '@nestjs/common';
import { VacanciesController } from './vacancies.controller';
import { VacanciesService } from './vacancies.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vacancy } from './vacancy.entity';
import { VacancyCategory } from './vacancy-category.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Vacancy, VacancyCategory]), UsersModule],
  controllers: [VacanciesController],
  providers: [VacanciesService]
})
export class VacanciesModule {}
