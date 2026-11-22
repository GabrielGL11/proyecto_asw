import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from '../user-role.enum.js';

@Entity('users')
export class User {
  @ApiProperty({ type: Number, example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ type: String, example: 'usuario@example.com' })
  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @ApiProperty({ enum: UserRole, example: UserRole.STUDENT })
  @Column({ type: 'enum', enum: UserRole, default: UserRole.STUDENT })
  role: UserRole;
}
