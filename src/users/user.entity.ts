import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { City } from '../cities/city.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/roles/role.entity';

@Entity('Users')
export class User {
  @ApiProperty({
    example: 'b75fe173-1e59-49ef-9527-ca2fd02bd75c',
    description: 'UUID for user',
  })
  @PrimaryGeneratedColumn(`uuid`)
  uuid: string;

  @ApiProperty({
    example: 'email@gmail.com',
    description: 'Email for user',
  })
  @Column()
  email: string;

  @ApiProperty({
    example: '$argon2i$v=19$m=16,t=2,p=1$MTIzNDIzNDU2NDU2NDU2$Lxgzhxe4rT83ET0XMJProQ',
    description: 'Hash password for user',
  })
  @Column()
  password: string;

  @ApiProperty({
    example: '/112c5ae8f078012e79117f9dc21afe1a.png',
    description: 'Photo url for user',
  })
  @Column({ default: 'image.png' })
  photo: string;

  @ApiProperty({
    example: City,
    description: 'City relation for user',
  })
  @ManyToOne(() => City, (city) => city.uuid)
  @JoinColumn()
  city: City;

  @ApiProperty({
    example: Role,
    description: 'Role relation for user',
  })
  @OneToOne(() => Role, (role) => role.uuid)
  @JoinColumn()
  role: Role;

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

  @ApiProperty({
    example: false,
    description: 'Banned user marker',
  })
  @Column({ default: false })
  banned: boolean;

  @ApiProperty({
    example: false,
    description: 'Deleted user marker',
  })
  @Column({ default: false })
  deleted: boolean;

  @ApiProperty({
    example: '$argon2i$v=19$m=16,t=2,p=1$MTIzNDIzNDU2NDU2NDU2$Lxgzhxe4rT83ET0XMJProQ',
    description: 'Hashed refresh token',
  })
  @Column({ nullable: true })
  hashedRefreshToken: string;
}
