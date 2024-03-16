import { BadRequestException, HttpStatus, Injectable } from "@nestjs/common";
import { AllProfessionalTrialsDto } from './dto/all-professional-trials.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfessionalTrial } from './professional-trial.entity';
import { getConnection, Repository } from 'typeorm';
import { ProfessionalTrialsStoreDto } from './dto/professional-trials-store.dto';
import { ProfessionalTrialCategory } from './professional-trial-category.entity';
import responses from '../global/responses';
import { ProfessionalTrialsUuidDto } from './dto/professional-trials-uuid.dto';
import { User } from '../users/user.entity';
import { deleteFile } from '../global/deleteFile';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import constants from '../global/constants';
import { UuidProfessionalTrialDto } from "./dto/uuid-professional-trial.dto";

@Injectable()
export class ProfessionalTrialsService {

  constructor(
    @InjectRepository(ProfessionalTrial) private professionalTrialsRepository: Repository<ProfessionalTrial>,
    @InjectRepository(ProfessionalTrialCategory) private professionalTrialsCategoryRepository: Repository<ProfessionalTrialCategory>,
    @InjectRepository(User) private usersRepository: Repository<User>,
    private configService: ConfigService,
    ) {}

//  Get

  async uuid(uuid: UuidProfessionalTrialDto) {
    return this.professionalTrialsRepository.findOne({
      where: {
        uuid: uuid.uuid,
        category: {
          shadow: false,
        },
        banned: false,
        deleted: false,
      },
      relations: {
        category: true,
      }
    });
  }

  async all(filters: AllProfessionalTrialsDto) {
    return this.professionalTrialsRepository.find({
      take: filters.row ? filters.row : 20,
      skip: (filters.row * filters.page) ? (filters.row * filters.page) : 0,
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
      relations: {
        category: true,
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

  async store(storeDto: ProfessionalTrialsStoreDto, user_uuid: string) {

    const category = await this.professionalTrialsCategoryRepository.findOne({
      where: {
        shadow: false,
        uuid: storeDto.category_uuid,
      },
    });

    if(!category) {
      throw new BadRequestException(responses.doesntExistUUID('Professional category'))
    }

    const user = await this.usersRepository.findOne({
      where: {
        uuid: user_uuid,
        deleted: false,
        banned: false,
      },
    })

    if(!user) {
      throw new BadRequestException(responses.doesntExistUUID('User'));
    }

    const professionalTrial = this.professionalTrialsRepository.create({
      category: category,
      title: storeDto.title,
      place: storeDto.place,
      time: storeDto.time,
      date: storeDto.date,
      employer: user,
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

  async deleteProfessionalTrial(professionalTrialUUID: ProfessionalTrialsUuidDto) {

    const professionalTrial = await this.professionalTrialsRepository.findOne({
      where: {
        uuid: professionalTrialUUID.professional_trial_uuid,
        deleted: false,
      }
    });

    professionalTrial.deleted = true;
    await this.professionalTrialsRepository.save(professionalTrial);
    return HttpStatus.OK;

  }

  async updateImage(professionalTrialUUID: ProfessionalTrialsUuidDto, filePath: string) {

    const profTrial = await this.professionalTrialsRepository.findOne({
      where: {
        uuid: professionalTrialUUID.professional_trial_uuid,
        category: {
          shadow: false,
        },
        banned: false,
        deleted: false,
      },
    });

    if(!profTrial) {
      throw new BadRequestException(responses.doesntExistUUID('Professional trial'));
    }

    deleteFile(join(this.configService.get<string>('STORAGE_FOLDER'), constants.professionalTrialsFolder, profTrial.image));

    profTrial.image = filePath;
    return this.professionalTrialsRepository.save(profTrial);

  }

  async edit(professionalTrialUUID: UuidProfessionalTrialDto, editDto: ProfessionalTrialsStoreDto) {
    const profTrial = await this.professionalTrialsRepository.findOne({
      where: {
        uuid: professionalTrialUUID.uuid,
        category: {
          shadow: false,
        },
        banned: false,
        deleted: false,
      },
      relations: {
        category: true,
      }
    });

    if(!profTrial) throw new BadRequestException(responses.doesntExistUUID('Professional trial'));

    const category = await this.professionalTrialsCategoryRepository.findOne({
      where: {
        shadow: false,
        uuid: editDto.category_uuid,
      },
    });

    if(!category) {
      throw new BadRequestException(responses.doesntExistUUID('Professional category'))
    }

    profTrial.category = category;
    profTrial.title = editDto.title;
    profTrial.place = editDto.place;
    profTrial.time = editDto.time;
    profTrial.date = editDto.date;

    return this.professionalTrialsRepository.save(profTrial);
  }

}
