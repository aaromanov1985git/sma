import {
  IsString,
  IsDateString,
  IsUUID,
  IsNumber,
  IsOptional,
  IsEnum,
  Min,
  Length,
} from 'class-validator';
import { Decision } from '../../../entities/waybill-item.entity';

/**
 * DTO для создания строки путевого листа
 */
export class CreateWaybillItemDto {
  @IsString()
  @Length(1, 50)
  plNumber: string;

  @IsDateString()
  datePL: string;

  @IsOptional()
  @IsDateString()
  timeStart?: string;

  @IsOptional()
  @IsDateString()
  timeEnd?: string;

  @IsUUID()
  positionId: string;

  @IsUUID()
  vehicleId: string;

  @IsUUID()
  statusPLId: string;

  // Наши данные
  @IsNumber()
  @Min(0)
  workHours: number;

  @IsNumber()
  @Min(0)
  mileage: number;

  @IsNumber()
  @Min(0)
  motoHours: number;

  @IsNumber()
  @Min(0)
  standbyWithDriver: number;

  @IsNumber()
  @Min(0)
  totalSum: number;

  // Данные заказчика
  @IsOptional()
  @IsNumber()
  @Min(0)
  customerWorkHours?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  customerMileage?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  customerMotoHours?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  customerStandby?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  customerTotalSum?: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsUUID()
  acceptedById?: string;

  @IsOptional()
  @IsEnum(Decision)
  decision?: Decision;
}

