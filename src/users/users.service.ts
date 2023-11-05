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

  async findByUUID(user_uuid: string): Promise<User | null> {
    return this.usersRepository.findOneBy({
      uuid: user_uuid,
    });
  }

  async createUser(dto: CreateUserDto): Promise<User> {
    // Hashing password
    dto.password = await bcrypt.hash(dto.password, 10);

    // Creating user
    const user = this.usersRepository.create({
      ...dto,
    });

    // Returning user
    return this.usersRepository.save(user);
  }

  async saveUser(user: User): Promise<User> {
    return this.usersRepository.save(user);
  }

  async update_refresh_token(user_uuid: string, hashed_token: string): Promise<User | null> {
    let user = await this.usersRepository.findOneBy({
      uuid: user_uuid,
    })

    user.hashedRefreshToken = hashed_token;
    return this.usersRepository.save(user);
  }
}
