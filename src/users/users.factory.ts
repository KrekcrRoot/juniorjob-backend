import { Injectable } from "@nestjs/common";
import { UsersService } from "./users.service";

import { fa, faker } from '@faker-js/faker';
import { CitiesService } from "src/cities/cities.service";
import { RolesService } from "src/roles/roles.service";
import { ApplicantUpdateDto } from "src/roles/dto/applicant-update.dto";
import logger from "src/logger";

@Injectable()
export class UsersFactory {

  constructor(
    private usersService: UsersService,
    private citiesService: CitiesService,
    private rolesService: RolesService,
  ) {}

  async seed(count: number) {

    const cities = await this.citiesService.getAllCities();

    for(let i = 0; i < count; i++) {

      const city_id = Math.floor(Math.random() * (cities.length + 1));

      let user = await this.usersService.createUser({
        email: faker.internet.email(),
        password: faker.internet.password(),
        city: cities[city_id],
      });

      let date = new Date();

      user.role.applicant = {
        uuid: user.role.applicant.uuid,
        name: faker.person.firstName(),
        surname: faker.person.lastName(),
        birthday: faker.date.birthdate(),
        study_place: faker.location.streetAddress(),
        inn: faker.number.int({min: 100000000000, max: 999999999999}).toString(),
        competitions: '[\'programming\']',
        summary: '',
        created_at: user.role.applicant.created_at,
        updated_at: date,
      }

      this.rolesService.updateApplicant(user.role.applicant as ApplicantUpdateDto, user.role.applicant.uuid);

    }

    

  }

  fabric() {
    this.seed(50).then(() => {
      logger.log({ level: 'info', message: 'Factory seeded' });
    });
  }

  onModuleInit(): void {}

}