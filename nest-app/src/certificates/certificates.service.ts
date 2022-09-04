import { InjectRepository } from '@nestjs/typeorm';
import { CarbonCertificateEntity } from '../entities/carbon-certificate.entity';
import { Repository } from 'typeorm';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';

export class CertificateService {
  constructor(
    @InjectRepository(CarbonCertificateEntity)
    private readonly carbonCertificateRepository: Repository<CarbonCertificateEntity>,
  ) {}

  getAll(
    options: IPaginationOptions,
  ): Promise<Pagination<CarbonCertificateEntity>> {
    return paginate<CarbonCertificateEntity>(
      this.carbonCertificateRepository,
      options,
    );
  }
}
