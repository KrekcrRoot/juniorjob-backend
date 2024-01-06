import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { NotificationEnum } from './notification.enum';
import { ApiProperty } from '@nestjs/swagger';

@Entity('Notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @ManyToMany(() => User, (user) => user.uuid)
  @JoinColumn()
  user: User;

  @Column({
    type: 'enum',
    enum: NotificationEnum,
    default: NotificationEnum.Default,
  })
  type: NotificationEnum;

  @Column()
  body: string;

  @Column({ default: false })
  viewed: boolean;

  @Column({ default: false })
  deleted: boolean;

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
