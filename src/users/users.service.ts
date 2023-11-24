import { ForbiddenException, HttpException, Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { CitiesService } from '../cities/cities.service';
import * as argon2 from 'argon2';
import { Applicant } from 'src/roles/models/applicant-role.entity';
import { Individual } from 'src/roles/models/individual-role.entity';
import { LegalEntity } from 'src/roles/models/legal-role.entity';
import { Role } from 'src/roles/role.entity';
import { Moderator } from 'src/roles/models/moderator-role.entity';
import { ChangePasswordDto } from './dto/change-password.dto';
import responses from 'src/global/responses';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Applicant) private applicantRepository: Repository<Applicant>,
    @InjectRepository(Individual) private individualRepository: Repository<Individual>,
    @InjectRepository(LegalEntity) private legalEntityRepository: Repository<LegalEntity>,
    @InjectRepository(Moderator) private moderatorRepository: Repository<Moderator>,
    @InjectRepository(Role) private roleRepository: Repository<Role>,
    private citiesService: CitiesService,
  ) {}

  async getAllUsers(): Promise<User[]> {
    return await this.usersRepository.find({ relations: { city: true, role: true } });
  }

  async findOne(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: {
        email: email,
      },
      relations: {
        city: true,
        role: true,
      }
    });
  }

  async findByUUID(user_uuid: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: {
        uuid: user_uuid,
      },
      relations: {
        city: true,
        role: true,
      }
    });
  }

  async createUser(dto: CreateUserDto): Promise<User> {
    // Hashing password
    dto.password = await argon2.hash(dto.password);

    // Creating user
    const user = this.usersRepository.create({
      ...dto,
    });

    const applicant = this.applicantRepository.create();
    const individual = this.individualRepository.create();
    const legal_entity = this.legalEntityRepository.create();
    const moderator = this.moderatorRepository.create();

    await this.applicantRepository.save(applicant);
    await this.individualRepository.save(individual);
    await this.legalEntityRepository.save(legal_entity);
    await this.moderatorRepository.save(moderator);

    const user_role = this.roleRepository.create({
      applicant: applicant,
      individual: individual,
      legal_entity: legal_entity,
      moderator: moderator,
    })

    await this.roleRepository.save(user_role);

    user.role = user_role;

    // Returning user
    return await this.usersRepository.save(user);
  }

  async saveUser(user: User): Promise<User> {
    return this.usersRepository.save(user);
  }

  async update_refresh_token(user_uuid: string, hashed_token: string): Promise<User | null> {
    let user = await this.usersRepository.findOneBy({
      uuid: user_uuid,
    });

    user.hashedRefreshToken = hashed_token;
    return this.usersRepository.save(user);
  }

  async changePassword(changePasswordDto: ChangePasswordDto, user_uuid: string) {
    let user = await this.usersRepository.findOneBy({
      uuid: user_uuid,
    });

    const result = await argon2.verify(user.password, changePasswordDto.previous_password);
    
    if(!result) throw new HttpException(responses.accessDenied, 401);

    user.password = await argon2.hash(changePasswordDto.new_password);
    return this.usersRepository.save(user); 
  }
}
