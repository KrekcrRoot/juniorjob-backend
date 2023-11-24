import { Injectable } from '@nestjs/common';
import { Vacancy } from './vacancy.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class VacanciesService {

    constructor(@InjectRepository(Vacancy) private vacancyRepository: Repository<Vacancy>) {}

    findByUUID(uuid: string): Promise<Vacancy | null> {
        return this.vacancyRepository.findOne({
            where: {
                uuid: uuid,
            },
        })
    }

}
