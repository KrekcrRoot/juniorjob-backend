import { Module } from '@nestjs/common';
import { CompetenciesService } from './competencies.service';
import { CompetenciesController } from './competencies.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Competence } from './competence.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Competence])],
  providers: [CompetenciesService],
  controllers: [CompetenciesController],
  exports: [CompetenciesService],
})
export class CompetenciesModule {}
