import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoursesController } from './courses/courses.controller';
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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
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
      ],
      synchronize: true,
    }),
    UsersModule,
    CitiesModule,
    AuthModule,
    RolesModule,
    VacanciesModule,
  ],
  controllers: [CoursesController, AuthController, StorageController],
  providers: [AuthService],
})
export class AppModule {}
