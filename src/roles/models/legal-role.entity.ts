import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('LegalEntities')
export class LegalEntity {

  @ApiProperty({
    example: '4b01b559-cc85-490a-bb72-51af66960fc0',
    description: 'Legal entity uuid',
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
    example: 'title',
    description: 'Legal entity company title',
  })
  @Column({ default: '' })
  title: string;

  @ApiProperty({
    example: '358822022749',
    description: 'Legal entity inn',
  })
  @Column({ default: '' })
  inn: string;

  @ApiProperty({
    example: 'contact info',
    description: 'Legal entity contact info',
  })
  @Column({ default: '' })
  contact_info: string;

  @ApiProperty({
    example: '{some json}',
    description: 'Legal entity summary',
  })
  @Column({ default: '' })
  summary: string;

}