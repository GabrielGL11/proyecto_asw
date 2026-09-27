import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}