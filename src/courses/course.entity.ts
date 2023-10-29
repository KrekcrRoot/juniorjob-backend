import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Courses')
export class Course {
  @PrimaryGeneratedColumn()
  id: bigint;
}
