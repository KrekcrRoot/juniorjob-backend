import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn, Timestamp } from 'typeorm';

@Entity('Applicants')
export class Applicant {
  @ApiProperty({
    example: '259c5111-ed8d-4cd1-ab54-1a0e0d72829d',
    description: 'Applicant uuid',
  })
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @ApiProperty({
    example: 'name',
    description: 'Applicant name',
  })
  @Column({ default: '' })
  name: string;

  @ApiProperty({
    example: 'surname',
    description: 'Applicant surname',
  })
  @Column({ default: '' })
  surname: string;

  @ApiProperty({
    example: new Date(),
    description: 'Applicant birthday',
  })
  @Column({ nullable: true })
  birthday: Date;

  @ApiProperty({
    example: '12 Apple Street, Constitution Hill',
    description: 'Applicant study place'
  })
  @Column({ default: '' })
  study_place: string;

  @ApiProperty({
    example: '355424152687',
    description: 'Applicant inn',
  })
  @Column({ default: '' })
  inn: string;

  @ApiProperty({
    example: '[\'programming\']',
    description: 'Applicant competitions in json array',
  })
  @Column({ default: '' })
  competitions: string;

  @ApiProperty({
    example: '{some json}',
    description: 'Applicant sumary in json',
  })
  @Column({ default: '' })
  summary: string;
}
