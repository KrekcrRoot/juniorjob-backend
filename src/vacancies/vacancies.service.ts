import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { User } from 'src/users/user.entity';
import { VacancyCategory } from './vacancy-category.entity';
import responses from 'src/global/responses';
import { Vacancy } from './vacancy.entity';
import { UserJwtDto } from 'src/users/dto/user-jwt.dto';
import { UserRole } from 'src/roles/role.enum';
import { EditVacancyDto } from './dto/edit-vacancy.dto';
import { AllFilterDto } from 'src/users/dto/all-users-filter.dto';
import { FilterProperties } from 'src/users/users.service';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AllFiltersSearchDto extends AllFilterDto {
  @ApiProperty({
    required: true,
    example: 'Some query',
    description: 'Query of search',
  })
  @IsString()
  query: string;
}

@Injectable()
export class VacanciesService {
  constructor(
    @InjectRepository(Vacancy) private vacancyRepository: Repository<Vacancy>,
    @InjectRepository(VacancyCategory)
    private vacancyCategoryRepository: Repository<VacancyCategory>,
  ) {}

  async findByUUID(uuid: string): Promise<Vacancy | null> {
    return this.vacancyRepository.findOne({
      where: {
        uuid: uuid,
        deleted: false,
      },
      relations: {
        employer: {
          role: {
            applicant: true,
            individual: true,
            legal_entity: true,
            moderator: true,
          },
        },
        category: true,
      },
    });
  }

  async create(
    createVacancyDto: CreateVacancyDto,
    user: User,
  ): Promise<Vacancy> {
    const category = await this.vacancyCategoryRepository.findOneBy({
      uuid: createVacancyDto.category_uuid,
    });

    if (!category) {
      throw new BadRequestException(
        responses.doesntExistUUID('Category of vacancy'),
      );
    }

    const vacancy = this.vacancyRepository.create({
      employer: user,
      category: category,
      ...createVacancyDto,
    });

    return this.vacancyRepository.save(vacancy);
  }

  async getByEmployer(user: User): Promise<Array<Vacancy> | null> {
    return this.vacancyRepository.find({
      where: {
        employer: {
          uuid: user.uuid,
        },
        deleted: false,
      },
      relations: {
        category: true,
      },
    });
  }

  makeQuery(filters: AllFilterDto) {
    let page = 0,
      row = 30;

    if (filters.page !== undefined) page = filters.page;
    if (filters.row !== undefined) row = filters.row;

    const query: FilterProperties = {
      skip: page * row,
      take: row,
      where: {
        deleted: false,
      },
      relations: {
        category: true,
        employer: {
          role: {
            applicant: true,
            individual: true,
            legal_entity: true,
            moderator: true,
          },
        },
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

    return query;
  }

  async search(filters: AllFiltersSearchDto) {
    const query = this.makeQuery(filters);
    query.where.title = ILike(`%${filters.query}%`);
    return await this.vacancyRepository.find(query);
  }

  async all(filters: AllFilterDto): Promise<Array<Vacancy> | null> {
    const query = this.makeQuery(filters);
    return await this.vacancyRepository.find(query);
  }

  async ban(vacancy_uuid: string) {
    const vacancy = await this.vacancyRepository.findOneBy({
      uuid: vacancy_uuid,
    });

    if (!vacancy)
      throw new BadRequestException(responses.doesntExistUUID('Vacancy'));
    vacancy.banned = true;

    return this.vacancyRepository.save(vacancy);
  }

  async unban(vacancy_uuid: string) {
    const vacancy = await this.vacancyRepository.findOneBy({
      uuid: vacancy_uuid,
    });

    if (!vacancy)
      throw new BadRequestException(responses.doesntExistUUID('Vacancy'));
    vacancy.banned = false;

    return this.vacancyRepository.save(vacancy);
  }

  async delete(vacancy_uuid: string, user: UserJwtDto) {
    const vacancy = await this.vacancyRepository.findOne({
      where: {
        uuid: vacancy_uuid,
        deleted: false,
        banned: false,
      },
      relations: {
        employer: true,
      },
    });

    if (!vacancy)
      throw new BadRequestException(responses.doesntExistUUID('Vacancy'));

    if (user.role != UserRole.Moderator && vacancy.employer.uuid != user.uuid) {
      throw new ForbiddenException(responses.accessDenied);
    }

    vacancy.deleted = true;

    await this.vacancyRepository.save(vacancy);
    return true;
  }

  async editImage(vacancyUUID: string, imageUrl: string) {
    const vacancy = await this.vacancyRepository.findOne({
      where: {
        uuid: vacancyUUID,
        deleted: false,
        banned: false,
      },
      relations: {
        category: true,
        employer: true,
      },
    });

    if (!vacancy)
      throw new BadRequestException(responses.doesntExistUUID('Vacancy'));

    vacancy.image = imageUrl;

    return this.vacancyRepository.save(vacancy);
  }

  async edit(editVacancyDto: EditVacancyDto, user: UserJwtDto) {
    let vacancy = await this.vacancyRepository.findOne({
      where: {
        uuid: editVacancyDto.uuid,
        deleted: false,
        banned: false,
      },
      relations: {
        employer: true,
      },
    });

    if (!vacancy)
      throw new BadRequestException(responses.doesntExistUUID('Vacancy'));

    const category = await this.vacancyCategoryRepository.findOneBy({
      uuid: editVacancyDto.category_uuid,
    });

    if (!category)
      throw new BadRequestException(
        responses.doesntExistUUID('Vacancy category'),
      );

    if (user.role != UserRole.Moderator && vacancy.employer.uuid != user.uuid) {
      throw new ForbiddenException(responses.accessDenied);
    }

    vacancy = {
      uuid: vacancy.uuid,
      employer: vacancy.employer,
      category: category,
      image: vacancy.image,
      ...editVacancyDto,
      deleted: vacancy.deleted,
      banned: vacancy.banned,
      created_at: vacancy.created_at,
      updated_at: new Date(),
      isClosedForResponse: vacancy.isClosedForResponse,
    };

    return this.vacancyRepository.save(vacancy);
  }
}
