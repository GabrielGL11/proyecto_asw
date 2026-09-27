import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
    @Column()
    email: string;
    @Column()
    age: number;
    @Column()
    career: string;
    @Column()
    semester: number;
    @Column()
    isActive: boolean;
}