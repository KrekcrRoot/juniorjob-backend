import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoursesController } from './courses/courses.controller';
import { RolesController } from './roles/roles.controller';
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
      ],
      synchronize: true,
    }),
    UsersModule,
    CitiesModule,
    AuthModule,
    RolesModule,
  ],
  controllers: [CoursesController, AuthController],
  providers: [AuthService],
})
export class AppModule {}
