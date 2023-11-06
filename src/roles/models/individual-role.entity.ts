import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('Individuals')
export class Individual {

  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ default: '' })
  name: string;

  @Column({ default: '' })
  surname: string;

  @Column({ default: '' })
  patronymic: string;

  @Column({ default: '' })
  summary: string;

}