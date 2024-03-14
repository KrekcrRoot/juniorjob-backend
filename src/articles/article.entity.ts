import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";


@Entity('Articles')
export class Article {

  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  preview: string;

  @Column()
  title: string;

  @Column()
  body: string;

  @Column({ default: 0 })
  views: number;

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