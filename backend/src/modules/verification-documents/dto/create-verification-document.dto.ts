import { Type } from 'class-transformer';
import {
  IsString,
  IsDateString,
  IsUUID,
  IsEnum,
  IsOptional,
  IsArray,
  ValidateNested,
  Length,
} from 'class-validator';
import { DocumentStatus } from '../../../entities/verification-document.entity';
import { CreateWaybillItemDto } from './create-waybill-item.dto';

/**
 * DTO для создания документа проверки объемов
 */
export class CreateVerificationDocumentDto {
  @IsString()
  @Length(1, 50)
  docNumber: string;

  @IsDateString()
  docDate: string;

  @IsString()
  @Length(1, 50)
  period: string;

  @IsUUID()
  organizationId: string;

  @IsUUID()
  counterpartyId: string;

  @IsString()
  @Length(1, 100)
  contractNumber: string;

  @IsOptional()
  @IsEnum(DocumentStatus)
  status?: DocumentStatus;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateWaybillItemDto)
  items?: CreateWaybillItemDto[];
}

