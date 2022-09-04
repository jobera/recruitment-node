import { InjectRepository } from '@nestjs/typeorm';
import { CarbonCertificateEntity } from '../entities/carbon-certificate.entity';
import { Repository } from 'typeorm';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { CarbonCertificatePaginationFilter } from './module';

export class CertificateService {
  constructor(
    @InjectRepository(CarbonCertificateEntity)
    private readonly repository: Repository<CarbonCertificateEntity>,
  ) {}

  getAll(
    options: IPaginationOptions,
    { status }: CarbonCertificatePaginationFilter,
  ): Promise<Pagination<CarbonCertificateEntity>> {
    const queryBuilder = this.repository.createQueryBuilder('c');
    queryBuilder.where('c.status = :status', { status });

    return paginate<CarbonCertificateEntity>(this.repository, options);
  }
}
