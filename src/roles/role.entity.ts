import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { UserRole } from "./role.enum";
import { Applicant } from "./models/applicant-role.entity";
import { Individual } from "./models/individual-role.entity";
import { LegalEntity } from "./models/legal-role.entity";
import { Moderator } from "./models/moderator-role.entity";

@Entity('Roles')
export class Role {

  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @OneToOne(() => Applicant, (applicant) => applicant.uuid)
  @JoinColumn()
  applicant: Applicant;

  @OneToOne(() => Individual, (individual) => individual.uuid)
  @JoinColumn()
  individual: Individual;

  @OneToOne(() => LegalEntity, (legal_entity) => legal_entity.uuid)
  @JoinColumn()
  legal_entity: LegalEntity;

  @OneToOne(() => Moderator, (moderator) => moderator.uuid)
  @JoinColumn()
  moderator: Moderator;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.Applicant,
  })
  current: UserRole;

}