import { Module } from '@nestjs/common';
import { VacancyResponsesController } from './vacancy-responses.controller';
import { VacancyResponsesService } from './vacancy-responses.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VacancyResponse } from './vacancy-response.entity';
import { UsersModule } from 'src/users/users.module';
import { VacanciesModule } from 'src/vacancies/vacancies.module';
import { NotificationsModule } from "../notifications/notifications.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([VacancyResponse]),
    UsersModule,
    VacanciesModule,
    NotificationsModule,
  ],
  controllers: [VacancyResponsesController],
  providers: [VacancyResponsesService],
})
export class VacancyResponsesModule {}
