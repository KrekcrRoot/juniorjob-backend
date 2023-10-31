import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { CitiesService } from '../cities/cities.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private citiesService: CitiesService,
  ) {}

  async getAllUsers(): Promise<User[]> {
    return await this.usersRepository.find({ relations: { city: true } });
  }

  async findOne(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: {
        email: email,
      },
    });
  }

  async createUser(dto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create({
      ...dto,
    });
    user.password = await bcrypt.hash(dto.password, await bcrypt.genSalt());
    await this.usersRepository.save(user);
    return user;
  }
}
