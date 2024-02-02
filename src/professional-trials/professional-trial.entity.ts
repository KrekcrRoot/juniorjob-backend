import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn, JoinTable, ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { ProfessionalTrialCategory } from './professional-trial-category.entity';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../users/user.entity';


@Entity('ProfessionalTrials')
export class ProfessionalTrial {

  @ApiProperty({
    example: 'b75fe173-1e59-49ef-9527-ca2fd02bd75c',
    description: 'UUID of professional trial'
  })
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Category of professional trial',
  })
  @ManyToOne(
    () => ProfessionalTrialCategory,
    (category) => category.uuid
  )
  @JoinColumn()
  category: ProfessionalTrialCategory;

  @Column({ default: 'default.png' })
  image: string;

  @ApiProperty({
    example: 'Some title',
    description: 'Title of professional trial',
  })
  @Column()
  title: string;

  @ApiProperty({
    example: 'Ulitsa pushkina, dom kolotushkina',
    description: 'Place of professional trial',
  })
  @Column()
  place: string;

  @ApiProperty({
    example: '2024-02-01T18:54:05.452Z',
    description: 'Date of professional trial in ISO 8601 format',
  })
  @Column()
  date: Date;

  @ApiProperty({
    example: '14:00 to 18:00',
    description: 'Time of professional trial',
  })
  @Column()
  time: string;

  @ManyToMany(() => User, (user) => user.uuid)
  @JoinTable({
    name: 'professional-trial-user'
  })
  user: User[];

  @ApiProperty({
    example: new Date(),
    description: 'Timestamp when trial created',
  })
  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;

  @ApiProperty({
    example: new Date(),
    description: 'Timestamp when trial updated',
  })
  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updated_at: Date;

  @Column({ default: false })
  deleted: boolean;

  @Column({ default: false })
  banned: boolean;
}