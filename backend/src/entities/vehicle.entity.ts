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
 * Сущность: Транспортное средство (справочник)
 * Хранит данные о ТС
 */
@Entity('vehicles')
export class Vehicle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  markModel: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 20, unique: true })
  govNumber: string;

  @Index()
  @Column({ type: 'varchar', length: 20 })
  garNumber: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Связи
  @OneToMany(() => WaybillItem, (item) => item.vehicle)
  waybillItems: WaybillItem[];
}

