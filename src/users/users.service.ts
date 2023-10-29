import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { CitiesService } from '../cities/cities.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private citiesService: CitiesService,
  ) {}

  async getAllUsers(): Promise<User[]> {
    return await this.usersRepository.find({ relations: { city: true } });
  }

  async createUser(dto: CreateUserDto) {
    return this.usersRepository.create({
      ...dto,
    });
  }
}
