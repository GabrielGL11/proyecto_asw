import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
export type ApplicationStatus = 'pendiente' | 'revision' | 'aprobada' | 'rechazada' | 'correccion';
@Entity('applications')
export class Application {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  studentId: number;
  @Column()
  scholarshipId: number;
  @Column('decimal', { precision: 10, scale: 2 })
  gpa: number;
  @Column('decimal', { precision: 10, scale: 2 })
  income: number;
  @Column({ nullable: true })
  comment?: string;
  @Column({
    type: 'enum',
    enum: ['pendiente', 'revision', 'aprobada', 'rechazada', 'correccion'],
    default: 'pendiente',
  })
  status: ApplicationStatus;
}