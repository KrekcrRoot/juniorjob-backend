import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty, ApiTags } from '@nestjs/swagger';

@ApiTags('Models')
@Entity('Cities')
export class City {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'UUID for city model',
  })
  @PrimaryGeneratedColumn(`uuid`)
  id: string;

  @ApiProperty({
    example: 'Смоленск',
    description: 'Title of city',
  })
  @Column({ unique: true })
  title: string;
}
