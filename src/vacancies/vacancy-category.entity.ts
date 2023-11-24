import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('VacancyCategories')
export class VacancyCategory {

    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column()
    title: string;

}