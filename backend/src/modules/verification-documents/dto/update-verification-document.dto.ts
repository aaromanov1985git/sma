import { PartialType } from '@nestjs/mapped-types';
import { CreateVerificationDocumentDto } from './create-verification-document.dto';

/**
 * DTO для обновления документа проверки объемов
 * Все поля опциональны
 */
export class UpdateVerificationDocumentDto extends PartialType(
  CreateVerificationDocumentDto,
) {}

