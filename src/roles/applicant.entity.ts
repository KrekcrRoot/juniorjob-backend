import { Column, Entity, PrimaryGeneratedColumn, Timestamp } from 'typeorm';

@Entity()
export class Applicant {
  @PrimaryGeneratedColumn(`uuid`)
  id: string;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column()
  birthday: Timestamp;

  @Column()
  study_place: string;
}
