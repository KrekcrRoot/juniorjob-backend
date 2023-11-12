import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
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

@Injectable()
export class RolesService {
 
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Applicant) private applicantRepository: Repository<Applicant>,
    @InjectRepository(Individual) private individualRepository: Repository<Individual>,
    @InjectRepository(LegalEntity) private legalEntityRepository: Repository<LegalEntity>,
    @InjectRepository(Moderator) private moderatorRepository: Repository<Moderator>,
    @InjectRepository(Role) private roleRepository: Repository<Role>,
  ) {}

  async findUserRole(user_uuid: string) {
    
    const user = await this.usersRepository.findOne({
      where: {
        uuid: user_uuid,
      },
      relations: {
        role: true
      },
    });

    if(!user) throw new BadRequestException('User not found');

    const role = await this.findRole(user.role.uuid);

    return role;

  }

  async findRole(role_uuid: string) {

    const role = await this.roleRepository.findOne({
      where: {
        uuid: role_uuid,
      },
      relations: {
        applicant: true,
        individual: true,
        legal_entity: true,
        moderator: true,
      }
    });

    return role;

  }

  async findApplicant(applicant_uuid: string) {

    const applicant = await this.applicantRepository.findOneBy({
      uuid: applicant_uuid,
    });

    if(!applicant) throw new BadRequestException('Applicant not found');

    return applicant;

  }

  async findIndividual(individual_uuid: string) {

    const individual = await this.individualRepository.findOneBy({
      uuid: individual_uuid,
    });

    if(!individual) throw new BadRequestException('Individual not found');

    return individual;

  }

  async findModerator(moderator_uuid: string) {

    const moderator = await this.moderatorRepository.findOneBy({
      uuid: moderator_uuid,
    });

    if(!moderator) throw new BadRequestException('Moderator not found');

    return moderator;

  }

  async findLegalEntity(legal_entity_uuid: string) {

    const legal_entity = await this.legalEntityRepository.findOneBy({
      uuid: legal_entity_uuid,
    });

    if(!legal_entity) throw new BadRequestException('Legal entity not found');

    return legal_entity;

  }


  // Updating roles

  async updateApplicant(applicantDto: ApplicantUpdateDto, applicant_uuid: string) {

    let role = await this.applicantRepository.findOneBy({
      uuid: applicant_uuid,
    });

    if(!role) {
      throw new BadRequestException('Role doesn\'t exist with this uuid');
    }

    role = {
      uuid: role.uuid,
      ...applicantDto
    };

    return await this.applicantRepository.save(role); 
  }

  async updateIndividual(individualDto: IndividualUpdateDto, individual_uuid: string) {

    let role = await this.individualRepository.findOneBy({
      uuid: individual_uuid,
    });

    if(!role) {
      throw new BadRequestException('Role doesn\'t exist with this uuid');
    }

    role = {
      uuid: role.uuid,
      ...individualDto,
    };

    return await this.individualRepository.save(role);

  }

  async updateLegalEntity(legalEntityDto: LegalEntityUpdateDto, legal_entity_uuid: string) {

    let role = await this.legalEntityRepository.findOneBy({
      uuid: legal_entity_uuid,
    });

    if(!role) {
      throw new BadRequestException('Role doesn\'t exist with this uuid');
    }

    role = {
      uuid: role.uuid,
      ...legalEntityDto,
    };

    return await this.legalEntityRepository.save(role);

  }

  async updateModerator(moderatorDto: ModeratorUpdateDto, moderator_uuid: string) {

    let role = await this.moderatorRepository.findOneBy({
      uuid: moderator_uuid,
    });

    if(!role) {
      throw new BadRequestException('Role doesn\'t exist with this uuid');
    }

    role = {
      uuid: role.uuid,
      ...moderatorDto,
    };

    return await this.moderatorRepository.save(role);

  }

  async changeCurrentRole(changeRoleDto: ChangeRoleDto, userJwt: UserJwtDto) {

    if(changeRoleDto.role == userJwt.role) {
      throw new BadRequestException('The user already has this role');
    }

    if(changeRoleDto.role == 'moderator') {
      throw new ForbiddenException('You don\'t have permissions for change role to moderator');
    }

    let user = await this.usersRepository.findOne({
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
