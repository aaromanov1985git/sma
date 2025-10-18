import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VerificationDocument } from '../../entities/verification-document.entity';
import { WaybillItem } from '../../entities/waybill-item.entity';
import { CreateVerificationDocumentDto } from './dto/create-verification-document.dto';
import { UpdateVerificationDocumentDto } from './dto/update-verification-document.dto';
import { UploadCustomerDataDto } from './dto/upload-customer-data.dto';

/**
 * Сервис для работы с документами проверки объемов
 */
@Injectable()
export class VerificationDocumentsService {
  constructor(
    @InjectRepository(VerificationDocument)
    private readonly documentRepository: Repository<VerificationDocument>,
    @InjectRepository(WaybillItem)
    private readonly waybillItemRepository: Repository<WaybillItem>,
  ) {}

  /**
   * Создать документ проверки объемов
   */
  async create(
    createDto: CreateVerificationDocumentDto,
    userId: string,
  ): Promise<VerificationDocument> {
    const document = this.documentRepository.create({
      ...createDto,
      organization: { id: createDto.organizationId } as any,
      counterparty: { id: createDto.counterpartyId } as any,
      createdBy: { id: userId } as any,
    });

    return await this.documentRepository.save(document);
  }

  /**
   * Получить все документы
   */
  async findAll(): Promise<VerificationDocument[]> {
    return await this.documentRepository.find({
      relations: ['organization', 'counterparty', 'createdBy', 'items'],
      order: { docDate: 'DESC' },
    });
  }

  /**
   * Получить документ по ID
   */
  async findOne(id: string): Promise<VerificationDocument> {
    const document = await this.documentRepository.findOne({
      where: { id },
      relations: [
        'organization',
        'counterparty',
        'createdBy',
        'items',
        'items.vehicle',
        'items.position',
        'items.statusPL',
        'items.acceptedBy',
      ],
    });

    if (!document) {
      throw new NotFoundException(`Документ с ID ${id} не найден`);
    }

    return document;
  }

  /**
   * Обновить документ
   */
  async update(
    id: string,
    updateDto: UpdateVerificationDocumentDto,
  ): Promise<VerificationDocument> {
    const document = await this.findOne(id);
    Object.assign(document, updateDto);

    if (updateDto.organizationId) {
      document.organization = { id: updateDto.organizationId } as any;
    }

    if (updateDto.counterpartyId) {
      document.counterparty = { id: updateDto.counterpartyId } as any;
    }

    return await this.documentRepository.save(document);
  }

  /**
   * Удалить документ
   */
  async remove(id: string): Promise<void> {
    const document = await this.findOne(id);
    await this.documentRepository.remove(document);
  }

  /**
   * Загрузить данные заказчика из Excel
   */
  async uploadCustomerData(
    documentId: string,
    uploadDto: UploadCustomerDataDto,
  ): Promise<VerificationDocument> {
    const document = await this.findOne(documentId);

    // Обновляем данные заказчика для каждой строки
    for (const customerData of uploadDto.data) {
      const item = document.items.find(
        (i) => i.plNumber === customerData.plNumber,
      );

      if (item) {
        item.customerWorkHours = customerData.workHours;
        item.customerMileage = customerData.mileage;
        item.customerMotoHours = customerData.motoHours;
        item.customerStandby = customerData.standby;
        item.customerTotalSum = customerData.totalSum;

        await this.waybillItemRepository.save(item);
      }
    }

    return await this.findOne(documentId);
  }

  /**
   * Получить статистику по документу
   */
  async getStatistics(documentId: string) {
    const document = await this.findOne(documentId);

    const total = document.items.length;
    const matches = document.items.filter((item) => item.matchStatus === 'match').length;
    const deviations = document.items.filter((item) => item.matchStatus === 'deviation').length;
    const missing = document.items.filter((item) => item.matchStatus === 'missing').length;

    const accepted = document.items.filter((item) => item.decision === 'accepted').length;
    const rejected = document.items.filter((item) => item.decision === 'rejected').length;
    const pending = document.items.filter((item) => item.decision === 'pending').length;

    return {
      total,
      matches,
      deviations,
      missing,
      matchPercentage: total > 0 ? ((matches / total) * 100).toFixed(1) : '0',
      accepted,
      rejected,
      pending,
    };
  }
}

