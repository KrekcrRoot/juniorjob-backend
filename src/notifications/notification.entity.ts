import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToOne,
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

  @ManyToOne(() => User, (user) => user.uuid)
  @JoinTable()
  user: User;

  @Column({
    type: 'enum',
    enum: NotificationEnum,
    default: NotificationEnum.Default,
  })
  type: NotificationEnum;

  @ApiProperty({
    example: false,
    description: 'Body of notification',
  })
  @Column()
  body: string;

  @ApiProperty({
    example: false,
    description: 'Viewed marker for notification',
  })
  @Column({ default: false })
  viewed: boolean;

  @ApiProperty({
    example: false,
    description: 'Deleted marker for notification',
  })
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
