import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Competencies')
export class Competence {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({nullable: false, unique: true})
  title: string;
}