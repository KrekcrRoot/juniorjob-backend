import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { VacancyResponse } from './vacancy-response.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Vacancy } from 'src/vacancies/vacancy.entity';
import { VacanciesService } from 'src/vacancies/vacancies.service';
import responses from 'src/global/responses';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { UUIDVacancyDto } from 'src/vacancies/dto/uuid-vacancy.dto';

@Injectable()
export class VacancyResponsesService {
  constructor(
    @InjectRepository(VacancyResponse)
    private vacancyResponseRepository: Repository<VacancyResponse>,
    private vacanciesService: VacanciesService,
    private usersService: UsersService,
  ) {}

  async findByUUID(uuid: string) {
    const vacancyResponse = await this.vacancyResponseRepository.findOne({
      where: {
        uuid: uuid,
        deleted: false,
      },
      relations: {
        vacancy: {
          employer: true,
        },
        applicant: true,
      },
    });

    if (!vacancyResponse)
      throw new BadRequestException(
        responses.doesntExistUUID('Vacancy response'),
      );

    return vacancyResponse;
  }

  async findAllByVacancy(vacancy_uuid: string) {
    return this.vacancyResponseRepository.find({
      where: {
        uuid: vacancy_uuid,
        deleted: false,
      },
      relations: {
        applicant: {
          role: true,
        },
      },
    });
  }

  async respond(vacancyResponseCreate: UUIDVacancyDto, applicant_uuid: string) {
    const vacancy: Vacancy = await this.vacanciesService.findByUUID(
      vacancyResponseCreate.uuid,
    );
    if (!vacancy)
      throw new BadRequestException(responses.doesntExistUUID('Vacancy'));

    const applicant: User = await this.usersService.findByUUID(applicant_uuid);
    if (!applicant)
      throw new BadRequestException(responses.doesntExistUUID('Applicant'));

    const vacancyResponse = this.vacancyResponseRepository.create({
      vacancy: vacancy,
      applicant: applicant,
    });

    return this.vacancyResponseRepository.save(vacancyResponse);
  }

  async findAllByApplicant(applicant_uuid: string) {
    return this.vacancyResponseRepository.find({
      where: {
        applicant: {
          uuid: applicant_uuid,
          deleted: false,
        },
        deleted: false,
      },
      relations: {
        vacancy: {
          employer: true,
        },
      },
    });
  }

  async findAllByEmployer(employer_uuid: string) {
    return this.vacancyResponseRepository.find({
      where: {
        vacancy: {
          employer: {
            uuid: employer_uuid,
            deleted: false,
          },
        },
        deleted: false,
      },
      relations: {
        vacancy: true,
        applicant: true,
      },
    });
  }

  async deleteByUUID(response_uuid: string) {
    const vacancyResponse: VacancyResponse =
      await this.vacancyResponseRepository.findOne({
        where: {
          uuid: response_uuid,
          deleted: false,
        },
      });

    vacancyResponse.deleted = true;

    return this.vacancyResponseRepository.save(vacancyResponse);
  }

  // test only
  async all() {
    return this.vacancyResponseRepository.find({
      relations: {
        applicant: true,
        vacancy: {
          employer: true,
        },
      },
    });
  }
}
