import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('Moderators')
export class Moderator {

  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ default: '' })
  name: string;

  @Column({ default: '' })
  surname: string;

}