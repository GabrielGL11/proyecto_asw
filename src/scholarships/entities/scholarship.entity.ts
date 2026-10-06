import { Column, Entity, OneToMany,PrimaryGeneratedColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import type { Application } from '../../applications/entities/application.entity.js';

@Entity('scholarships')
    export class Scholarship {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    amount: number;

    @Column()
    startDate: string;

    @Column()
    endDate: string;

    @Column()
    isActive: boolean;

    @OneToMany(
        'Application',
        'scholarship',
    )
    applications: Relation<Application[]>;
}