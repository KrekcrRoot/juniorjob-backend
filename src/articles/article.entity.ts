import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";


@Entity('Articles')
export class Article {

  @ApiProperty({
    example: 'c1b26d9b-6212-4c7b-927a-758c7f123742',
    description: 'UUID of article'
  })
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @ApiProperty({
    example: '/dfsdfqr23dassd.png',
    description: 'Src for preview article'
  })
  @Column({ default: 'default.png' })
  preview: string;

  @ApiProperty({
    example: 'lorem ipsum',
    description: 'Title of article'
  })
  @Column()
  title: string;

  @ApiProperty({
    example: 'a lot of body',
    description: 'Body of article'
  })
  @Column()
  body: string;

  @ApiProperty({
    example: 100,
    description: 'Views of article'
  })
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