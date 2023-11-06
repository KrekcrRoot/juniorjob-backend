import { Column, Entity, PrimaryGeneratedColumn, Timestamp } from 'typeorm';

@Entity('Applicants')
export class Applicant {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ default: '' })
  name: string;

  @Column({ default: '' })
  surname: string;

  @Column({ nullable: true })
  birthday: Date;

  @Column({ default: '' })
  study_place: string;

  @Column({ default: '' })
  inn: string;

  @Column({ default: '' })
  competitions: string;

  @Column({ default: '' })
  summary: string;
}
