import { InjectRepository } from '@nestjs/typeorm';
import { CarbonCertificateEntity } from '../entities/carbon-certificate.entity';
import { Repository, UpdateResult } from 'typeorm';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { CarbonCertificatePaginationFilter } from './module';
import { CertificateStatusEnum } from './certificate.status.enum';

export class CertificatesService {
  constructor(
    @InjectRepository(CarbonCertificateEntity)
    private readonly repository: Repository<CarbonCertificateEntity>,
  ) {}

  getOne(id: number): Promise<CarbonCertificateEntity | null> {
    return this.repository.findOneBy({ id });
  }

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

  transferCertificateOwnership(
    id: number,
    fromOwnerId: number,
    toOwnerId: number,
  ): Promise<UpdateResult> {
    return this.repository.update(
      { id, ownerId: fromOwnerId },
      { status: CertificateStatusEnum.transferred, ownerId: toOwnerId },
    );
  }
}
