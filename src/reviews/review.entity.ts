import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Applicant } from '../roles/models/applicant-role.entity';
import { User } from '../users/user.entity';

export enum MarkEnum {
  Empty = -1, Zero, One, Two, Three, Four, Five
}

@Entity('Reviews')
export class Review {

  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @ManyToOne(() => Applicant, (applicant) => applicant.uuid)
  @JoinTable()
  applicant: Applicant;

  @ManyToOne(() => User, (author) => author.uuid)
  @JoinTable()
  author: User;

  @Column({
    type: 'enum',
    enum: MarkEnum,
    default: MarkEnum.Empty,
  })
  mark: MarkEnum;

  @Column({
    nullable: false,
    length: 1024,
  })
  body: string;

  @Column({ default: false })
  deleted: boolean;

  @Column({ default: false })
  banned: boolean;

  @ApiProperty({
    example: new Date(),
    description: 'Timestamp when notification created',
  })
  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;

  @ApiProperty({
    example: new Date(),
    description: 'Timestamp when notification updated',
  })
  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updated_at: Date;

}