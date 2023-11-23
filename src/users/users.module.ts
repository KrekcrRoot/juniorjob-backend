import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CitiesModule } from '../cities/cities.module';
import { Applicant } from 'src/roles/models/applicant-role.entity';
import { Individual } from 'src/roles/models/individual-role.entity';
import { LegalEntity } from 'src/roles/models/legal-role.entity';
import { Role } from 'src/roles/role.entity';
import { Moderator } from 'src/roles/models/moderator-role.entity';
import { UsersFactory } from './users.factory';

@Module({
  imports: [TypeOrmModule.forFeature([User, Applicant, Individual, LegalEntity, Role, Moderator]), CitiesModule],
  exports: [TypeOrmModule, UsersService, UsersFactory],
  controllers: [UsersController],
  providers: [UsersService, UsersFactory],
})
export class UsersModule {}