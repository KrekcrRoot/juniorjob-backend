import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('Moderators')
export class Moderator {

  @ApiProperty({
    example: 'cd8f67f5-82fa-4152-87bc-faacba1accb6',
    description: 'Moderator uuid',
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
    description: 'Moderator name',
  })
  @Column({ default: '' })
  name: string;

  @ApiProperty({
    example: 'surname',
    description: 'Moderator surname',
  })
  @Column({ default: '' })
  surname: string;

}