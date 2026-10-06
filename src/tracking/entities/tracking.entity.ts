import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import type { Application } from '../../applications/entities/application.entity.js';

@Entity('tracking')
    export class Tracking {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    applicationId: number;

    @Column()
    status: string;

    @Column({ nullable: true })
    comment: string;

    @Column()
    createdAt: string;

    @ManyToOne(
        'Application',
        'trackings',
        {
        nullable: false,
        onDelete: 'CASCADE',
        },
    )
    @JoinColumn({ name: 'applicationId' })
    application: Relation<Application>;
}