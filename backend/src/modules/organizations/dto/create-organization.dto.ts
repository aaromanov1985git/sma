import { IsString, IsBoolean, IsOptional, Length } from 'class-validator';

/**
 * DTO для создания организации
 */
export class CreateOrganizationDto {
  @IsString()
  @Length(1, 255)
  name: string;

  @IsString()
  @Length(10, 12)
  inn: string;

  @IsOptional()
  @IsString()
  @Length(9, 9)
  kpp?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

