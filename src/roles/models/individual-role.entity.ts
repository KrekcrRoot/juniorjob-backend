import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('Individuals')
export class Individual {

  @ApiProperty({
    example: 'e8d66321-6981-43c7-a435-cdb45c34e23d',
    description: 'Individual uuid',
  })
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @ApiProperty({
    example: '456d9574-ed8d-4cd1-ab54-1a0e0d72829d',
    description: 'User uuid',
  })
  @Column({ nullable: true })
  user_uuid: string;

  @ApiProperty({
    example: 'name',
    description: 'Individual name',
  })
  @Column({ default: '' })
  name: string;

  @ApiProperty({
    example: 'surname',
    description: 'Individual surname',
  })
  @Column({ default: '' })
  surname: string;

  @ApiProperty({
    example: 'patronymic',
    description: 'Individual patronymic'
  })
  @Column({ default: '' })
  patronymic: string;

  @ApiProperty({
    example: '{some json}',
    description: 'Individual summary',
  })
  @Column({ default: '' })
  summary: string;

}