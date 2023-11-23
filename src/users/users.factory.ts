import { Injectable } from "@nestjs/common";
import { UsersService } from "./users.service";

import { faker } from '@faker-js/faker';
import { CitiesService } from "src/cities/cities.service";

@Injectable()
export class UsersFactory {

  constructor(
    private usersService: UsersService,
    private citiesService: CitiesService,
  ) {}

  async seed(count: number) {

    const cities = await this.citiesService.getAllCities();

    for(let i = 0; i < count; i++) {

      const city_id = Math.floor(Math.random() * (cities.length + 1));

      this.usersService.createUser({
        email: faker.internet.email(),
        password: faker.internet.password(),
        city: cities[city_id],
      })

    }

    

  }

}