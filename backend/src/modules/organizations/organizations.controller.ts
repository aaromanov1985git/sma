import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

/**
 * Контроллер для работы с организациями
 */
@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  /**
   * Создать организацию
   * POST /organizations
   */
  @Post()
  create(@Body() createDto: CreateOrganizationDto) {
    return this.organizationsService.create(createDto);
  }

  /**
   * Получить все организации
   * GET /organizations
   */
  @Get()
  findAll() {
    return this.organizationsService.findAll();
  }

  /**
   * Получить организацию по ID
   * GET /organizations/:id
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.organizationsService.findOne(id);
  }

  /**
   * Обновить организацию
   * PATCH /organizations/:id
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateOrganizationDto) {
    return this.organizationsService.update(id, updateDto);
  }

  /**
   * Удалить организацию
   * DELETE /organizations/:id
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.organizationsService.remove(id);
  }
}

