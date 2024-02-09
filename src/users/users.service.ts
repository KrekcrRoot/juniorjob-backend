import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as argon2 from 'argon2';
import { Applicant } from 'src/roles/models/applicant-role.entity';
import { Individual } from 'src/roles/models/individual-role.entity';
import { LegalEntity } from 'src/roles/models/legal-role.entity';
import { Role } from 'src/roles/role.entity';
import { Moderator } from 'src/roles/models/moderator-role.entity';
import { ChangePasswordDto } from './dto/change-password.dto';
import responses from 'src/global/responses';
import { AllFilterDto } from './dto/all-users-filter.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationEnum } from '../notifications/notification.enum';
import notifications from '../global/notifications';
import { ChangeEmailDto } from './dto/change-email.dto';
import { deleteFile } from '../global/deleteFile';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import constants from '../global/constants';

export interface FilterProperties {
  [key: string]: any;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Applicant)
    private applicantRepository: Repository<Applicant>,
    @InjectRepository(Individual)
    private individualRepository: Repository<Individual>,
    @InjectRepository(LegalEntity)
    private legalEntityRepository: Repository<LegalEntity>,
    @InjectRepository(Moderator)
    private moderatorRepository: Repository<Moderator>,
    @InjectRepository(Role) private roleRepository: Repository<Role>,
    private notificationsService: NotificationsService,
    private configService: ConfigService,
  ) {}

  async getAllUsers(filters: AllFilterDto) {
    let page = 0,
      row = 30;

    if (filters.page !== undefined) page = filters.page;
    if (filters.row !== undefined) row = filters.row;

    if (filters.byDate !== undefined) {
      return await this.usersRepository.find({
        skip: page * row,
        take: row,
        where: {
          created_at: filters.byDate,
          deleted: false,
        },
        relations: {
          city: true,
          role: true,
        },
      });
    }

    const query: FilterProperties = {
      skip: page * row,
      take: row,
      where: {
        deleted: false,
      },
      relations: {
        city: true,
        role: true,
      },
    };

    if (filters.sortByCreatedAt !== undefined) {
      query.order = {};
      query.order.created_at = filters.sortByCreatedAt == 'Up' ? 'ASC' : 'DESC';
    }
    if (filters.sortByUpdatedAt !== undefined) {
      query.order == undefined ? (query.order = {}) : false;
      query.order.updated_at = filters.sortByUpdatedAt == 'Up' ? 'ASC' : 'DESC';
    }

    return await this.usersRepository.find(query);
  }

  async findOne(email: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({
      where: {
        email: email,
      },
      relations: {
        city: true,
        role: true,
      },
    });

    if (!user) return null;

    if (user.deleted) return null;
    return user;
  }

  async findWithRelation(user_uuid: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({
      where: {
        uuid: user_uuid,
      },
      relations: {
        city: true,
        role: {
          applicant: true,
          individual: true,
          legal_entity: true,
          moderator: true,
        },
      }
    });

    if (!user || user.deleted) return null;
    return user;
  }

  async findByUUID(user_uuid: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({
      where: {
        uuid: user_uuid,
      },
      relations: {
        city: true,
        role: true,
      }
    });

    if (!user || user.deleted) return null;
    return user;
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
    });

    await this.roleRepository.save(user_role);

    user.role = user_role;

    // Returning user
    const userRes = await this.usersRepository.save(user);

    applicant.user_uuid = userRes.uuid;
    individual.user_uuid = userRes.uuid;
    legal_entity.user_uuid = userRes.uuid;
    moderator.user_uuid = userRes.uuid;

    (() => {
      this.applicantRepository.save(applicant);
      this.individualRepository.save(individual);
      this.legalEntityRepository.save(legal_entity);
      this.moderatorRepository.save(moderator);
    })()

    return userRes;
  }

  async saveUser(user: User): Promise<User> {
    return this.usersRepository.save(user);
  }

  async update_refresh_token(
    user_uuid: string,
    hashed_token: string,
  ): Promise<User | null> {
    const user = await this.usersRepository.findOneBy({
      uuid: user_uuid,
    });

    user.hashedRefreshToken = hashed_token;
    return this.usersRepository.save(user);
  }

  async changeEmail(changeEmailDto: ChangeEmailDto, user_uuid: string) {
    const user = await this.usersRepository.findOne({
      where: {
        uuid: user_uuid,
        deleted: false,
        banned: false,
      },
    });

    if (!user) {
      throw new BadRequestException(responses.doesntExistUUID('User'));
    }

    const result = await argon2.verify(user.password, changeEmailDto.password);
    if (!result) throw new HttpException(responses.accessDenied, 401);

    user.email = changeEmailDto.email;

    this.notificationsService
      .create({
        user: user,
        type: NotificationEnum.Warning,
        body: notifications.changedEmail,
      })
      .then();

    return this.usersRepository.save(user);
  }

  async changePassword(
    changePasswordDto: ChangePasswordDto,
    user_uuid: string,
  ) {
    const user = await this.usersRepository.findOneBy({
      uuid: user_uuid,
    });

    if (!user) {
      throw new BadRequestException(responses.doesntExistUUID('User'));
    }

    const result = await argon2.verify(
      user.password,
      changePasswordDto.previous_password,
    );

    if (!result) throw new HttpException(responses.accessDenied, 401);

    user.password = await argon2.hash(changePasswordDto.new_password);

    this.notificationsService
      .create({
        user: user,
        type: NotificationEnum.Default,
        body: notifications.changedPassword,
      })
      .then();

    return this.usersRepository.save(user);
  }

  async ban(user_uuid: string) {
    const user = await this.usersRepository.findOneBy({
      uuid: user_uuid,
    });

    if (!user) {
      throw new BadRequestException(responses.doesntExistUUID('User'));
    }

    user.banned = true;

    return this.usersRepository.save(user);
  }

  async unban(user_uuid: string) {
    const user = await this.usersRepository.findOneBy({
      uuid: user_uuid,
    });

    if (!user) {
      throw new BadRequestException(responses.doesntExistUUID('User'));
    }

    user.banned = false;

    return this.usersRepository.save(user);
  }

  async delete(user_uuid: string) {
    const user = await this.usersRepository.findOneBy({
      uuid: user_uuid,
    });

    if (!user) {
      throw new BadRequestException(responses.doesntExistUUID('User'));
    }

    user.deleted = true;

    return this.usersRepository.save(user);
  }

  async updateImage(user_uuid: string, image: string) {
    const user = await this.usersRepository.findOneBy({
      uuid: user_uuid,
    });

    if (!user) {
      throw new BadRequestException(responses.doesntExistUUID('User'));
    }

    if(user.image !== 'image.png') {
      deleteFile(join(
        this.configService.get<string>('STORAGE_FOLDER'),
        constants.usersFolder,
        user.image,
      ))
    }

    user.image = image;

    return this.usersRepository.save(user);
  }
}
