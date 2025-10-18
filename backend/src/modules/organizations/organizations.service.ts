import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from '../../entities/organization.entity';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

/**
 * Сервис для работы с организациями
 */
@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
  ) {}

  /**
   * Создать организацию
   */
  async create(createDto: CreateOrganizationDto): Promise<Organization> {
    const organization = this.organizationRepository.create(createDto);
    return await this.organizationRepository.save(organization);
  }

  /**
   * Получить все организации
   */
  async findAll(): Promise<Organization[]> {
    return await this.organizationRepository.find({
      where: { isActive: true },
      order: { name: 'ASC' },
    });
  }

  /**
   * Получить организацию по ID
   */
  async findOne(id: string): Promise<Organization> {
    const organization = await this.organizationRepository.findOne({
      where: { id },
    });

    if (!organization) {
      throw new NotFoundException(`Организация с ID ${id} не найдена`);
    }

    return organization;
  }

  /**
   * Обновить организацию
   */
  async update(
    id: string,
    updateDto: UpdateOrganizationDto,
  ): Promise<Organization> {
    const organization = await this.findOne(id);
    Object.assign(organization, updateDto);
    return await this.organizationRepository.save(organization);
  }

  /**
   * Удалить организацию (soft delete)
   */
  async remove(id: string): Promise<void> {
    const organization = await this.findOne(id);
    organization.isActive = false;
    await this.organizationRepository.save(organization);
  }

  /**
   * Получить организацию по ИНН
   */
  async findByInn(inn: string): Promise<Organization | null> {
    return await this.organizationRepository.findOne({
      where: { inn },
    });
  }
}

