import { BadRequestException, Injectable } from '@nestjs/common';
import { AllProfessionalTrialsDto } from './dto/all-professional-trials.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfessionalTrial } from './professional-trial.entity';
import { getConnection, Repository } from 'typeorm';
import { ProfessionalTrialsStoreDto } from './dto/professional-trials-store.dto';
import { ProfessionalTrialCategory } from './professional-trial-category.entity';
import responses from '../global/responses';
import { ProfessionalTrialsUuidDto } from './dto/professional-trials-uuid.dto';
import { User } from '../users/user.entity';

@Injectable()
export class ProfessionalTrialsService {

  constructor(
    @InjectRepository(ProfessionalTrial) private professionalTrialsRepository: Repository<ProfessionalTrial>,
    @InjectRepository(ProfessionalTrialCategory) private professionalTrialsCategoryRepository: Repository<ProfessionalTrialCategory>,
    @InjectRepository(User) private usersRepository: Repository<User>,
    ) {}

//  Get

  async all(filters: AllProfessionalTrialsDto) {
    return this.professionalTrialsRepository.find({
      take: filters.row,
      skip: filters.row * filters.page,
      where: {
        deleted: false,
        banned: false,
        category: {
          shadow: false,
        },
      },
      order: {
        created_at: 'ASC',
      },
    });
  }

  async byUser(user_uuid: string) {

    return this.professionalTrialsRepository.find({
      where: {
        user: {
          uuid: user_uuid,
        },
        category: {
          shadow: false,
        },
        deleted: false,
        banned: false,
      },
      order: {
        created_at: 'ASC',
      },
    })

  }

//   Work with data

  async store(storeDto: ProfessionalTrialsStoreDto) {

    const category = await this.professionalTrialsCategoryRepository.findOne({
      where: {
        shadow: false,
        uuid: storeDto.category_uuid,
      },
    });

    if(!category) {
      throw new BadRequestException(responses.doesntExistUUID('Professional category'))
    }

    const professionalTrial = this.professionalTrialsRepository.create({
      category: category,
      title: storeDto.title,
      place: storeDto.place,
      time: storeDto.time,
      date: storeDto.date,
    });

    return this.professionalTrialsRepository.save(professionalTrial);

  }

  async checkData(professionalTrialUUID: ProfessionalTrialsUuidDto, user_uuid: string) {
    const user: User = await this.usersRepository.findOne({
      where: {
        uuid: user_uuid,
        banned: false,
        deleted: false,
      }
    })

    if(!user) throw new BadRequestException(responses.doesntExistUUID('User'));

    const profTrial: ProfessionalTrial = await this.professionalTrialsRepository.findOne({
      where: {
        uuid: professionalTrialUUID.professional_trial_uuid,
        category: {
          shadow: false,
        },
        deleted: false,
        banned: false,
      },
    });

    if(!profTrial) throw new BadRequestException(responses.doesntExistUUID('Professional trial'));

    const trial = await this.professionalTrialsRepository.findOne({
      where: {
        user: {
          uuid: user_uuid,
        },
        uuid: professionalTrialUUID.professional_trial_uuid,
      },
    })

    return [profTrial, user, trial];
  }

  async respond(professionalTrialUUID: ProfessionalTrialsUuidDto, user_uuid: string) {

    const [profTrial, user, trial] = await this.checkData(professionalTrialUUID, user_uuid);

    if(trial) {
      throw new BadRequestException(responses.alreadyExist('Response to professional trial'));
    }

    return await this.professionalTrialsRepository
      .createQueryBuilder()
      .relation(ProfessionalTrial, "user")
      .of(profTrial)
      .add(user);

  }

  async deleteRespond(professionalTrialUUID: ProfessionalTrialsUuidDto, user_uuid: string) {

    const [profTrial, user, trial] = await this.checkData(professionalTrialUUID, user_uuid);

    if(!trial) {
      throw new BadRequestException(responses.doesntExistUUID('Response to professional trial'));
    }

    return await this.professionalTrialsRepository
      .createQueryBuilder()
      .relation(ProfessionalTrial, "user")
      .of(profTrial)
      .remove(user);

  }

}