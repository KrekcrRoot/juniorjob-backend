import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { City } from '../cities/city.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User {
  @ApiProperty({
    example: 'b75fe173-1e59-49ef-9527-ca2fd02bd75c',
    description: 'UUID for user',
  })
  @PrimaryGeneratedColumn(`uuid`)
  id: string;

  @ApiProperty({
    example: 'email@gmail.com',
    description: 'Email for user',
  })
  @Column()
  email: string;

  @ApiProperty({
    example: '64dfb04e',
    description: 'Hash password for user',
  })
  @Column()
  password: string;

  @ApiProperty({
    example: '/112c5ae8f078012e79117f9dc21afe1a.png',
    description: 'Photo url for user',
  })
  @Column()
  photo: string;

  @ApiProperty({
    example: City,
    description: 'City relation for user',
  })
  @ManyToOne(() => City, (city) => city.id)
  city: City;
}
