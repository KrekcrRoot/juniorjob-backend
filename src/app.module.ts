import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoursesController } from './courses/courses.controller';
import { RolesController } from './roles/roles.controller';
import * as process from 'process';
import { User } from './users/user.entity';
import { City } from './cities/city.entity';
import { UsersModule } from './users/users.module';
import { CitiesModule } from './cities/cities.module';

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
      password: process.env.POSTGRES_PASS,
      database: process.env.POSTGRES_DB,
      entities: [User, City],
      synchronize: true,
    }),
    UsersModule,
    CitiesModule,
  ],
  controllers: [CoursesController, RolesController],
  providers: [],
})
export class AppModule {}
