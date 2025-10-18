import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { Organization } from './organization.entity';
import { Counterparty } from './counterparty.entity';
import { User } from './user.entity';
import { WaybillItem } from './waybill-item.entity';

export enum DocumentStatus {
  DRAFT = 'draft',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

/**
 * Сущность: Документ проверки объемов
 * Основной документ для сверки путевых листов
 */
@Entity('verification_documents')
export class VerificationDocument {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 50, unique: true })
  docNumber: string;

  @Column({ type: 'date' })
  docDate: Date;

  @Index()
  @Column({ type: 'varchar', length: 50 })
  period: string;

  @Index()
  @ManyToOne(() => Organization, (organization) => organization.documents)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @Index()
  @ManyToOne(() => Counterparty, (counterparty) => counterparty.documents)
  @JoinColumn({ name: 'counterparty_id' })
  counterparty: Counterparty;

  @Column({ type: 'varchar', length: 100 })
  contractNumber: string;

  @Index()
  @Column({
    type: 'enum',
    enum: DocumentStatus,
    default: DocumentStatus.DRAFT,
  })
  status: DocumentStatus;

  @ManyToOne(() => User, (user) => user.createdDocuments)
  @JoinColumn({ name: 'created_by_id' })
  createdBy: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Связи
  @OneToMany(() => WaybillItem, (item) => item.document, {
    cascade: true,
  })
  items: WaybillItem[];
}

