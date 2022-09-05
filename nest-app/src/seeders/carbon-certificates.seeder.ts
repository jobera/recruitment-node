import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Seeder, DataFactory } from 'nestjs-seeder';
import { Repository } from 'typeorm';
import { CarbonCertificatesFactory } from './factory/carbon-certificates.factory';
import { CarbonCertificateEntity } from '../entities/carbon-certificate.entity';
import { CertificateStatusEnum } from '../certificates/certificate.status.enum';

@Injectable()
export class CarbonCertificatesSeeder implements Seeder {
  constructor(
    @InjectRepository(CarbonCertificateEntity)
    private readonly repository: Repository<CarbonCertificateEntity>,
  ) {}

  async seed(): Promise<void> {
    await this.generateRandomCertificates(95);
  }

  async drop(): Promise<void> {
    await this.repository.clear();
    await this.repository.query(
      'DELETE FROM sqlite_sequence WHERE name = "carbon_certificate_entity"',
    );
  }

  private async generateRandomCertificates(total: number): Promise<void> {
    const certificates = DataFactory.createForClass(
      CarbonCertificatesFactory,
    ).generate(total);

    await this.repository.save(certificates);
  }

  async generateOwnedCertificate(ownerId: number): Promise<void> {
    const certificate = DataFactory.createForClass(
      CarbonCertificatesFactory,
    ).generate(1, {
      ownerId,
      status: CertificateStatusEnum.owned,
    });

    await this.repository.save(certificate);
  }
}
