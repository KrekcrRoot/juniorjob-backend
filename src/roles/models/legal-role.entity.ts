import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('LegalEntities')
export class LegalEntity {

  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ default: '' })
  title: string;

  @Column({ default: '' })
  inn: string;

  @Column({ default: '' })
  contact_info: string;

  @Column({ default: '' })
  summary: string;

}