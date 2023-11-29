import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { User } from 'src/users/user.entity';
import { VacancyCategory } from './vacancy-category.entity';
import responses from 'src/global/responses';
import { Vacancy } from './vacancy.entity';
import { UserJwtDto } from 'src/users/dto/user-jwt.dto';
import { UserRole } from 'src/roles/role.enum';
import { EditVacancyDto } from './dto/edit-vacancy.dto';

@Injectable()
export class VacanciesService {

    constructor(
        @InjectRepository(Vacancy) private vacancyRepository: Repository<Vacancy>,
        @InjectRepository(VacancyCategory) private vacancyCategoryRepository: Repository<VacancyCategory>,
        ) {}

    async findByUUID(uuid: string): Promise<Vacancy | null> {
        return this.vacancyRepository.findOne({
            where: {
                uuid: uuid,
            },
        })
    }

    async create(createVacancyDto: CreateVacancyDto, user: User): Promise<Vacancy> {

        const category = await this.vacancyCategoryRepository.findOneBy({
            uuid: createVacancyDto.category_uuid
        });

        if(!category) {
            throw new BadRequestException(responses.doesntExistUUID('Category of vacancy'))
        }

        return this.vacancyRepository.create({
            employer: user,
            category: category,
            ...createVacancyDto,
        });

    }

    async getByEmployer(user: User): Promise<Array<Vacancy> | null> {
        
        return this.vacancyRepository.find({
            where: {
                employer: user,
                deleted: false,
            },
            relations: {
                category: true,
            },
        });

    }

    async all(): Promise<Array<Vacancy> | null> {

        return this.vacancyRepository.find({
            where: {
                deleted: false,
            },
            relations: {
                category: true,
            }
        })

    }

    async ban(vacancy_uuid: string) {

        let vacancy = await this.vacancyRepository.findOneBy({ uuid: vacancy_uuid });
        
        if(!vacancy) throw new BadRequestException(responses.doesntExistUUID('Vacancy'));
        vacancy.banned = true;

        return this.vacancyRepository.save(vacancy);

    }

    async unban(vacancy_uuid: string) {

        let vacancy = await this.vacancyRepository.findOneBy({ uuid: vacancy_uuid });
        
        if(!vacancy) throw new BadRequestException(responses.doesntExistUUID('Vacancy'));
        vacancy.banned = false;

        return this.vacancyRepository.save(vacancy);

    }

    async delete(vacancy_uuid: string, user: UserJwtDto) {

        let vacancy = await this.vacancyRepository.findOne({ 
            where: {
                uuid: vacancy_uuid ,
                deleted: false,
                banned: false,
            },
            relations: {
                employer: true,
            },
        });

        if(!vacancy) throw new BadRequestException(responses.doesntExistUUID('Vacancy'));

        if(user.role != UserRole.Moderator && vacancy.employer.uuid != user.uuid) {
            throw new ForbiddenException(responses.accessDenied);
        }
    
        vacancy.deleted = true;

        await this.vacancyRepository.save(vacancy);
        return true;

    }

    async edit(editVacancyDto: EditVacancyDto, user: UserJwtDto) {

        let vacancy = await this.vacancyRepository.findOne({
            where: {
                uuid: editVacancyDto.uuid,
                deleted: false,
                banned: false,
            },
        })

        if(!vacancy) throw new BadRequestException(responses.doesntExistUUID('Vacancy'));

        const category = await this.vacancyCategoryRepository.findOneBy({
            uuid: editVacancyDto.category_uuid,
        });

        if(!category) throw new BadRequestException(responses.doesntExistUUID('Vacancy category'));

        if(user.role != UserRole.Moderator && vacancy.employer.uuid != user.uuid) {
            throw new ForbiddenException(responses.accessDenied);
        }

        vacancy = {
            uuid: vacancy.uuid,
            employer: vacancy.employer,
            category: category,
            ...editVacancyDto,
            deleted: vacancy.deleted,
            banned: vacancy.banned,
        };

        return this.vacancyRepository.save(vacancy);

    }

}
