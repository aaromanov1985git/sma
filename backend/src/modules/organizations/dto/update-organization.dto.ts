import { PartialType } from '@nestjs/mapped-types';
import { CreateOrganizationDto } from './create-organization.dto';

/**
 * DTO для обновления организации
 * Все поля опциональны
 */
export class UpdateOrganizationDto extends PartialType(CreateOrganizationDto) {}

