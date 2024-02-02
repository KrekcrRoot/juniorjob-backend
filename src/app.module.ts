import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as process from 'process';
import { UsersModule } from './users/users.module';
import { CitiesModule } from './cities/cities.module';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';

// Entities
import { User } from './users/user.entity';
import { City } from './cities/city.entity';
import { Role } from './roles/role.entity';
import { Applicant } from './roles/models/applicant-role.entity';
import { Individual } from './roles/models/individual-role.entity';
import { LegalEntity } from './roles/models/legal-role.entity';
import { Moderator } from './roles/models/moderator-role.entity';
import { VacanciesModule } from './vacancies/vacancies.module';
import { Vacancy } from './vacancies/vacancy.entity';
import { VacancyCategory } from './vacancies/vacancy-category.entity';
import { StorageController } from './storage/storage.controller';
import { ServerModule } from './server/server.module';
import { VacancyResponsesModule } from './vacancy-responses/vacancy-responses.module';
import { VacancyResponse } from './vacancy-responses/vacancy-response.entity';
import { NotificationsModule } from './notifications/notifications.module';
import { Notification } from './notifications/notification.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { ReviewsModule } from './reviews/reviews.module';
import { Review } from './reviews/review.entity';
import { ProfessionalTrialsModule } from './professional-trials/professional-trials.module';
import { ProfessionalTrial } from './professional-trials/professional-trial.entity';
import { ProfessionalTrialCategory } from './professional-trials/professional-trial-category.entity';
import { StorageService } from './storage/storage.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: `postgres`,
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [
        User,
        City,
        Role,
        Applicant,
        Individual,
        LegalEntity,
        Moderator,
        Vacancy,
        VacancyCategory,
        VacancyResponse,
        Notification,
        Review,
        ProfessionalTrialCategory,
        ProfessionalTrial,
      ],
      synchronize: true,
    }),
    UsersModule,
    CitiesModule,
    AuthModule,
    RolesModule,
    VacanciesModule,
    ServerModule,
    VacancyResponsesModule,
    NotificationsModule,
    ReviewsModule,
    ProfessionalTrialsModule,
  ],
  controllers: [AuthController, StorageController],
  providers: [AuthService, StorageService],
})
export class AppModule {}
