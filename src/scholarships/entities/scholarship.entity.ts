import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
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
}