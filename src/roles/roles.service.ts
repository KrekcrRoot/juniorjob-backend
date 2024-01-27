import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ILike, Repository } from 'typeorm';
import { Applicant } from './models/applicant-role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Individual } from './models/individual-role.entity';
import { LegalEntity } from './models/legal-role.entity';
import { Moderator } from './models/moderator-role.entity';
import { Role } from './role.entity';
import { ApplicantUpdateDto } from './dto/applicant-update.dto';
import { IndividualUpdateDto } from './dto/individual-update.dto';
import { LegalEntityUpdateDto } from './dto/legal-update.dto';
import { ModeratorUpdateDto } from './dto/moderator-update.dto';
import { ChangeRoleDto } from './dto/change-role.dto';
import { UserJwtDto } from 'src/users/dto/user-jwt.dto';
import responses from 'src/global/responses';

@Injectable()
export class RolesService {
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
  ) {}

  async findUserRole(user_uuid: string) {
    const user = await this.usersRepository.findOne({
      where: {
        uuid: user_uuid,
      },
      relations: {
        role: true,
      },
    });

    if (!user) throw new BadRequestException(responses.notFound('User'));

    return await this.findRole(user.role.uuid);
  }

  async findRole(role_uuid: string) {
    return await this.roleRepository.findOne({
      where: {
        uuid: role_uuid,
      },
      relations: {
        applicant: true,
        individual: true,
        legal_entity: true,
        moderator: true,
      },
    });
  }

  async findApplicantByName(name: string) {
    return await this.applicantRepository.find({
      where: {
        name: ILike(`%${name}%`),
      },
    });
  }

  async findApplicantBySurname(surname: string) {
    return await this.applicantRepository.find({
      where: {
        surname: ILike(`%${surname}%`),
      },
    });
  }

  async findApplicantByFullName(full_name: string) {
    const full_name_split = full_name.split(' ');
    let result: Array<Applicant>;
    if (full_name_split.length === 1) {
      result = await this.findApplicantByName(full_name_split[0]);
      (await this.findApplicantBySurname(full_name_split[0])).forEach((el) => {
        if (!result.find((obj) => obj.uuid === el.uuid)) {
          result.push(el);
        }
      });
    } else {
      result = await this.findApplicantByName(full_name_split[0]);
      (await this.findApplicantBySurname(full_name_split[1])).forEach((el) => {
        if (!result.find((obj) => obj.uuid === el.uuid)) {
          result.push(el);
        }
      });
    }

    return [...new Set([...result])];
  }

  async findApplicant(applicant_uuid: string) {
    const applicant = await this.applicantRepository.findOneBy({
      uuid: applicant_uuid,
    });

    if (!applicant)
      throw new BadRequestException(responses.notFound('Applicant'));

    return applicant;
  }

  async findIndividual(individual_uuid: string) {
    const individual = await this.individualRepository.findOneBy({
      uuid: individual_uuid,
    });

    if (!individual)
      throw new BadRequestException(responses.notFound('Individual'));

    return individual;
  }

  async findModerator(moderator_uuid: string) {
    const moderator = await this.moderatorRepository.findOneBy({
      uuid: moderator_uuid,
    });

    if (!moderator)
      throw new BadRequestException(responses.notFound('Moderator'));

    return moderator;
  }

  async findLegalEntity(legal_entity_uuid: string) {
    const legal_entity = await this.legalEntityRepository.findOneBy({
      uuid: legal_entity_uuid,
    });

    if (!legal_entity)
      throw new BadRequestException(responses.notFound('Legal entity'));

    return legal_entity;
  }

  // Updating roles

  async updateApplicant(
    applicantDto: ApplicantUpdateDto,
    applicant_uuid: string,
  ) {
    let role = await this.applicantRepository.findOneBy({
      uuid: applicant_uuid,
    });

    if (!role) {
      throw new BadRequestException(responses.doesntExistUUID('Role'));
    }

    role = {
      uuid: role.uuid,
      ...applicantDto,
    };

    return await this.applicantRepository.save(role);
  }

  async updateIndividual(
    individualDto: IndividualUpdateDto,
    individual_uuid: string,
  ) {
    let role = await this.individualRepository.findOneBy({
      uuid: individual_uuid,
    });

    if (!role) {
      throw new BadRequestException(responses.doesntExistUUID('Role'));
    }

    role = {
      uuid: role.uuid,
      ...individualDto,
    };

    return await this.individualRepository.save(role);
  }

  async updateLegalEntity(
    legalEntityDto: LegalEntityUpdateDto,
    legal_entity_uuid: string,
  ) {
    let role = await this.legalEntityRepository.findOneBy({
      uuid: legal_entity_uuid,
    });

    if (!role) {
      throw new BadRequestException(responses.doesntExistUUID('Role'));
    }

    role = {
      uuid: role.uuid,
      ...legalEntityDto,
    };

    return await this.legalEntityRepository.save(role);
  }

  async updateModerator(
    moderatorDto: ModeratorUpdateDto,
    moderator_uuid: string,
  ) {
    let role = await this.moderatorRepository.findOneBy({
      uuid: moderator_uuid,
    });

    if (!role) {
      throw new BadRequestException(responses.doesntExistUUID('Role'));
    }

    role = {
      uuid: role.uuid,
      ...moderatorDto,
    };

    return await this.moderatorRepository.save(role);
  }

  async changeCurrentRole(changeRoleDto: ChangeRoleDto, userJwt: UserJwtDto) {
    if (changeRoleDto.role == userJwt.role) {
      throw new BadRequestException(responses.userAlreadyHaveRole);
    }

    if (changeRoleDto.role == 'moderator') {
      throw new ForbiddenException(
        responses.permission('change role to moderator'),
      );
    }

    const user = await this.usersRepository.findOne({
      where: {
        uuid: userJwt.uuid,
      },
      relations: {
        role: true,
      },
    });

    user.role.current = changeRoleDto.role;

    return await this.roleRepository.save(user.role);
  }
}
