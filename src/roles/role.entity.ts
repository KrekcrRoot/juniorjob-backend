import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { UserRole } from './role.enum';
import { Applicant } from './models/applicant-role.entity';
import { Individual } from './models/individual-role.entity';
import { LegalEntity } from './models/legal-role.entity';
import { Moderator } from './models/moderator-role.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('Roles')
export class Role {
  @ApiProperty({
    example: 'b75fe173-1e59-49ef-9527-ca2fd02bd75c',
    description:
      'UUID for role (this uuid is relation of users.role_uuid column)',
  })
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @ApiProperty({
    example: Applicant,
    description: 'Applicant relation',
  })
  @OneToOne(() => Applicant, (applicant) => applicant.uuid)
  @JoinColumn()
  applicant: Applicant;

  @ApiProperty({
    example: Individual,
    description: 'Individual relation',
  })
  @OneToOne(() => Individual, (individual) => individual.uuid)
  @JoinColumn()
  individual: Individual;

  @ApiProperty({
    example: LegalEntity,
    description: 'Legal entity relation',
  })
  @OneToOne(() => LegalEntity, (legal_entity) => legal_entity.uuid)
  @JoinColumn()
  legal_entity: LegalEntity;

  @ApiProperty({
    example: Moderator,
    description: 'Moderator relation',
  })
  @OneToOne(() => Moderator, (moderator) => moderator.uuid)
  @JoinColumn()
  moderator: Moderator;

  @ApiProperty({
    example: 'Applicant',
    description: 'Current role',
  })
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.Applicant,
  })
  current: UserRole;
}
