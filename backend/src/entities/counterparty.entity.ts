import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { VerificationDocument } from './verification-document.entity';

/**
 * Сущность: Контрагент (справочник)
 * Хранит данные о подрядчиках
 */
@Entity('counterparties')
export class Counterparty {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 12 })
  inn: string;

  @Column({ type: 'varchar', length: 9, nullable: true })
  kpp: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Связи
  @OneToMany(
    () => VerificationDocument,
    (document) => document.counterparty,
  )
  documents: VerificationDocument[];
}

