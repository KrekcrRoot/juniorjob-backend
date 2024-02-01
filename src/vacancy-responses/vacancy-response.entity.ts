import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/user.entity';
import { Vacancy } from 'src/vacancies/vacancy.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('VacancyResponses')
export class VacancyResponse {
  @ApiProperty({
    example: 'c494eb10-cc10-4fc4-905f-c59975098128',
    description: 'Response uuid',
  })
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @ApiProperty({
    example: '74e2e030-c439-4330-8d28-25143224b672',
    description: 'Response relation to vacancy',
  })
  @ManyToOne(() => Vacancy, (vacancy) => vacancy.uuid)
  vacancy: Vacancy;

  @ApiProperty({
    example: 'e6d240d1-fb4d-4ef8-8f0f-05f4d48ec243',
    description: 'Response relation to user',
  })
  @ManyToOne(() => User, (user) => user.uuid)
  applicant: User;

  @ApiProperty({
    example: 'Lorem ipsum se dolor',
    description: 'Message of applicant to vacancy'
  })
  @Column()
  message: string;

  @ApiProperty({
    example: new Date(),
    description: 'Timestamp when user created',
  })
  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;

  @ApiProperty({
    example: new Date(),
    description: 'Timestamp when user updated',
  })
  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updated_at: Date;

  @ApiProperty({
    example: false,
    description: 'Deleted user marker',
  })
  @Column({ default: false })
  deleted: boolean;
}
