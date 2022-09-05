import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Seeder, DataFactory } from 'nestjs-seeder';
import { Repository } from 'typeorm';
import { CarbonCertificatesFactory } from './factory/carbon-certificates.factory';
import { CarbonCertificateEntity } from '../entities/carbon-certificate.entity';

@Injectable()
export class CarbonCertificatesSeeder implements Seeder {
  constructor(
    @InjectRepository(CarbonCertificateEntity)
    private readonly repository: Repository<CarbonCertificateEntity>,
  ) {}

  async seed(): Promise<any> {
    await this.generateRandomCertificates(95);
  }

  async drop(): Promise<any> {
    await this.repository.clear();
    return this.repository.query(
      'DELETE FROM sqlite_sequence WHERE name = "carbon_certificate_entity"',
    );
  }

  private async generateRandomCertificates(total: number): Promise<void> {
    const certificates = DataFactory.createForClass(
      CarbonCertificatesFactory,
    ).generate(total);

    await this.repository.save(certificates);
  }
}
