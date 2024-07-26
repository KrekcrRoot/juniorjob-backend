import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('Competencies')
export class Competence {
  @ApiProperty({
    example: 'c1b26d9b-6212-4c7b-927a-758c7f123742',
    description: 'UUID of competence',
  })
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @ApiProperty({
    example: 'Компетенция',
    description: 'Title of competence',
  })
  @Column({ nullable: false, unique: true })
  title: string;
}
