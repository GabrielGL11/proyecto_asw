import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export type DocumentStatus = 'pendiente' | 'cargado' | 'observado' | 'aprobado';

@Entity('documents')
export class Document {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  applicationId: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  url?: string;

  @Column({
    type: 'enum',
    enum: ['pendiente', 'cargado', 'observado', 'aprobado'],
    default: 'pendiente',
  })
  status: DocumentStatus;
}