import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { VerificationDocument } from './verification-document.entity';
import { Vehicle } from './vehicle.entity';
import { Position } from './position.entity';
import { StatusPL } from './status-pl.entity';
import { User } from './user.entity';

export enum Decision {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

/**
 * Сущность: Строка путевого листа
 * Табличная часть документа проверки объемов
 */
@Entity('waybill_items')
export class WaybillItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @ManyToOne(() => VerificationDocument, (document) => document.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'document_id' })
  document: VerificationDocument;

  @Index()
  @Column({ type: 'varchar', length: 50 })
  plNumber: string;

  @Column({ type: 'date' })
  datePL: Date;

  @Column({ type: 'timestamp', nullable: true })
  timeStart: Date;

  @Column({ type: 'timestamp', nullable: true })
  timeEnd: Date;

  @Index()
  @ManyToOne(() => Position, (position) => position.waybillItems)
  @JoinColumn({ name: 'position_id' })
  position: Position;

  @Index()
  @ManyToOne(() => Vehicle, (vehicle) => vehicle.waybillItems)
  @JoinColumn({ name: 'vehicle_id' })
  vehicle: Vehicle;

  @ManyToOne(() => StatusPL, (statusPL) => statusPL.waybillItems)
  @JoinColumn({ name: 'status_pl_id' })
  statusPL: StatusPL;

  // Наши данные (из 1С)
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  workHours: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  mileage: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  motoHours: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  standbyWithDriver: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  totalSum: number;

  // Данные заказчика (из Excel)
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  customerWorkHours: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  customerMileage: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  customerMotoHours: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  customerStandby: number;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    nullable: true,
  })
  customerTotalSum: number;

  // Общие поля
  @Column({ type: 'text', nullable: true })
  notes: string;

  @ManyToOne(() => User, (user) => user.acceptedWaybills)
  @JoinColumn({ name: 'accepted_by_id' })
  acceptedBy: User;

  @Column({
    type: 'enum',
    enum: Decision,
    default: Decision.PENDING,
  })
  decision: Decision;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Вычисляемые свойства
  get hasDeviations(): boolean {
    if (!this.customerWorkHours) return true;

    const tolerance = 0.01;
    return (
      Math.abs(this.workHours - this.customerWorkHours) > tolerance ||
      Math.abs(this.mileage - this.customerMileage) > tolerance ||
      Math.abs(this.motoHours - this.customerMotoHours) > tolerance ||
      Math.abs(this.standbyWithDriver - this.customerStandby) > tolerance
    );
  }

  get matchStatus(): 'match' | 'deviation' | 'missing' {
    if (!this.customerWorkHours && this.customerWorkHours !== 0) {
      return 'missing';
    }
    return this.hasDeviations ? 'deviation' : 'match';
  }
}

