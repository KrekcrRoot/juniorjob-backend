import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('ProfessionalTrialCategories')
export class ProfessionalTrialCategory {

  @ApiProperty({
    example: 'c1d4c0c7-003d-4958-83ea-0c76ae821f0f',
    description: 'UUID of professional trial category',
  })
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @ApiProperty({
    example: 'Some title',
    description: 'Title of professional trial category',
  })
  @Column()
  title: string;

  @Column({ default: false })
  shadow: boolean;

}