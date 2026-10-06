import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import type { Application } from '../../applications/entities/application.entity.js';

@Entity('students')
    export class Student {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    nationalId: string;

    @Column({ unique: true })
    email: string;

    @Column()
    age: number;

    @Column()
    career: string;

    @Column()
    semester: number;

    @Column()
    isActive: boolean;

    @OneToMany(
        'Application',
        'student',
    )
    applications: Relation<Application[]>;
}