import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('Applicants')
export class Applicant {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    example: '259c5111-ed8d-4cd1-ab54-1a0e0d72829d',
    description: 'Applicant uuid',
  })
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @ApiProperty({
    example: '456d9574-ed8d-4cd1-ab54-1a0e0d72829d',
    description: 'User uuid',
  })
  @Column({ nullable: true })
  user_uuid: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'name',
    description: 'Applicant name',
  })
  @Column({ default: '' })
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'surname',
    description: 'Applicant surname',
  })
  @Column({ default: '' })
  surname: string;

  @IsDateString()
  @ApiProperty({
    example: new Date(),
    description: 'Applicant birthday',
  })
  @Column({ nullable: true })
  birthday: Date;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '12 Apple Street, Constitution Hill',
    description: 'Applicant study place'
  })
  @Column({ default: '' })
  study_place: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '355424152687',
    description: 'Applicant inn',
  })
  @Column({ default: '' })
  inn: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '[\'programming\']',
    description: 'Applicant competitions in json array',
  })
  @Column({ default: '' })
  competitions: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '{some json}',
    description: 'Applicant sumary in json',
  })
  @Column({ default: '' })
  summary: string;

  @ApiProperty({
    example: new Date(),
    description: 'Timestamp when user created',
  })
  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;

  @ApiProperty({
    example: new Date(),
    description: 'Timestamp when user updated',
  })
  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updated_at: Date;
}
