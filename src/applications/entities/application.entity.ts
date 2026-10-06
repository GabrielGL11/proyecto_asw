import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique} from 'typeorm';
import type { Relation } from 'typeorm';
import type { Student } from '../../students/entities/students.entity.js';
import type { Scholarship } from '../../scholarships/entities/scholarship.entity.js';
import type { Document } from '../../documents/entities/document.entity.js';
import type { Tracking } from '../../tracking/entities/tracking.entity.js';

export type ApplicationStatus =
  | 'pendiente'
  | 'revision'
  | 'aprobada'
  | 'rechazada'
  | 'correccion';

@Entity('applications')
@Unique(['student', 'scholarship'])
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
      enum: [
        'pendiente',
        'revision',
        'aprobada',
        'rechazada',
        'correccion',
      ],
      default: 'pendiente',
    })
    status: ApplicationStatus;

    @ManyToOne(
      'Student',
      'applications',
      {
        nullable: false,
        onDelete: 'RESTRICT',
      },
    )
    @JoinColumn({ name: 'studentId' })
    student: Relation<Student>;

    @ManyToOne(
      'Scholarship',
      'applications',
      {
        nullable: false,
        onDelete: 'RESTRICT',
      },
    )
    @JoinColumn({ name: 'scholarshipId' })
    scholarship: Relation<Scholarship>;

    @OneToMany(
      'Document',
      'application',
    )
    documents: Relation<Document[]>;

    @OneToMany(
      'Tracking',
      'application',
    )
    trackings: Relation<Tracking[]>;
}