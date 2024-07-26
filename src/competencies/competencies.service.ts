import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Competence } from './competence.entity';
import { Repository } from 'typeorm';
import responses from '../global/responses';
import { CompetenceStoreDto } from './dto/competenceStore.dto';

@Injectable()
export class CompetenciesService {

  constructor(@InjectRepository(Competence) private competenciesRepository: Repository<Competence>) {}

  async findAll() {
    return await this.competenciesRepository.find();
  }

  async findByTitleUnsafe(title: string) {
    return await this.competenciesRepository.findOne({
      where: { title },
    });
  }

  async findByTitle(title: string) {
    const competence = await this.findByTitleUnsafe(title);

    if (!competence) throw new BadRequestException(responses.doesntExist(`Competence '${title}'`));

    return competence;
  }

  async findByUuid(uuid: string) {
    const competence = await this.competenciesRepository.findOne({
      where: { uuid },
    });

    if (!competence) throw new BadRequestException(responses.doesntExistUUID('Competence'));

    return competence;
  }

  async deleteByUuid(uuid: string) {
    return this.competenciesRepository.delete({ uuid });
  }

  async store(competenceStoreDto: CompetenceStoreDto) {

    const competenceExists = await this.findByTitleUnsafe(competenceStoreDto.title);

    if (competenceExists) throw new BadRequestException(
      responses.alreadyExist(`Competence '${competenceStoreDto.title}'`)
    );

    const competence = this.competenciesRepository.create({
      ...competenceStoreDto,
    });

    return this.competenciesRepository.save(competence);
  }

}
