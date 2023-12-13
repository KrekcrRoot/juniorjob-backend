import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('VacancyCategories')
export class VacancyCategory {

    @ApiProperty({
        example: 'e808c757-eb54-4191-9273-487f162fe48e',
        description: 'UUID of vacancy category',
    })
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @ApiProperty({
        example: 'Ipsum dapibus et dictum eleifend',
        description: 'Title of vacancy category'
    })
    @Column()
    title: string;

    @ApiProperty({
        example: '/url/to/img',
        description: 'Vacancy category url',
    })
    @Column({ default: 'image.png' })
    image: string;

}