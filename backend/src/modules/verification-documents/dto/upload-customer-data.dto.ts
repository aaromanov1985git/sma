import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO для одной строки данных заказчика
 */
class CustomerWaybillData {
  plNumber: string;
  workHours: number;
  mileage: number;
  motoHours: number;
  standby: number;
  totalSum: number;
}

/**
 * DTO для загрузки данных заказчика из Excel
 */
export class UploadCustomerDataDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CustomerWaybillData)
  data: CustomerWaybillData[];
}

