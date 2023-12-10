import { User } from "src/users/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { VacancyCategory } from "./vacancy-category.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity('Vacancies')
export class Vacancy {

    @ApiProperty({
        example: '51741c2f-49d6-4dac-b9cb-bb311736ccf3',
        description: 'UUID of vacancy'
    })
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @ApiProperty({
        example: 'c1412620-12e0-4ae7-aa70-3ce353f86371',
        description: 'UUID of employer',
    })
    @ManyToOne(() => User, (user) => user.uuid)
    employer: User;

    @ApiProperty({
        example: 'Pellentesque dapibus non efficitur dolor integer',
        description: 'Vacancy title',
    })
    @Column()
    title: string;

    @ApiProperty({
        example: VacancyCategory,
        description: 'Vacancy category',
    })
    @ManyToOne(() => VacancyCategory, (category) => category.uuid)
    category: VacancyCategory;
    
    @ApiProperty({
        example: '14:00 - 17:00 12.02.2023 - 24.02.2023',
        description: 'Time of vacancy',
    })
    @Column()
    time: string;

    @ApiProperty({
        example: 'Somewhere',
        description: 'Place of vacancy',
    })
    @Column()
    place: string;

    @ApiProperty({
        example: 'Efficitur malesuada pellentesque velit lacinia morbi amet, ornare orci, sed nulla faucibus. Sapien dui pulvinar nulla sed morbi mattis non vel mattis integer et. Est. Odio. Pellentesque lectus in imperdiet sodales sapien imperdiet morbi lectus mattis ornar',
        description: 'Description of vacancy',
    })
    @Column()
    description: string;

    @ApiProperty({
        example: '/storage/vacancies/12345.png',
        description: 'Image url',
    })
    @Column({ default: 'image.png' })
    image: string;

    @ApiProperty({
        example: true,
        description: 'Is this vacancy requires experience',
    })
    @Column({ default: false })
    required_experience: boolean;
    
    @ApiProperty({
        example: false,
        description: 'Multiple applicants may apply for this position',
    })
    @Column({ default: false })
    several_applicants: boolean;

    @ApiProperty({
        example: false,
        description: 'Is this vacancy deleted'
    })
    @Column({ default: false })
    deleted: boolean;

    @ApiProperty({
        example: false,
        description: 'Is this vacancy banned',
    })
    @Column({ default: false })
    banned: boolean;

}