import { InjectRepository } from '@nestjs/typeorm';
import { CarbonCertificateEntity } from '../entities/carbon-certificate.entity';
import { Repository } from 'typeorm';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { CarbonCertificatePaginationFilter } from './module';

export class CertificatesService {
  constructor(
    @InjectRepository(CarbonCertificateEntity)
    private readonly repository: Repository<CarbonCertificateEntity>,
  ) {}

  getAll(
    options: IPaginationOptions,
    { status, ownerId = null }: CarbonCertificatePaginationFilter,
  ): Promise<Pagination<CarbonCertificateEntity>> {
    const queryBuilder = this.repository.createQueryBuilder('c');
    queryBuilder.where('c.status IN (:...status)', { status });

    if (ownerId) {
      queryBuilder.andWhere('c.ownerId = :ownerId', { ownerId });
    } else {
      queryBuilder.andWhere('c.ownerId IS NULL');
    }

    return paginate<CarbonCertificateEntity>(queryBuilder, options);
  }
}
