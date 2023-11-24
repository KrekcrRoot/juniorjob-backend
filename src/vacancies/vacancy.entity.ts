import { User } from "src/users/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { VacancyCategory } from "./vacancy-category.entity";

@Entity('Vacancies')
export class Vacancy {

    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @ManyToOne(() => User, (user) => user.uuid)
    employer_uuid: User;

    @Column()
    title: string;

    @ManyToOne(() => VacancyCategory, (category) => category.uuid)
    category: VacancyCategory;
    
    @Column()
    time: string;

    @Column()
    place: string;

    @Column({ default: false })
    required_experience: boolean;
    
    @Column({ default: false })
    several_applicants: boolean;

}