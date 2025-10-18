import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { WaybillItem } from './waybill-item.entity';

/**
 * Сущность: Статус путевого листа (справочник)
 * Хранит возможные статусы ПЛ
 */
@Entity('status_pl')
export class StatusPL {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 50, unique: true })
  code: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Связи
  @OneToMany(() => WaybillItem, (item) => item.statusPL)
  waybillItems: WaybillItem[];
}

