import { Factory } from 'nestjs-seeder';
import { CertificateStatusEnum } from '../../certificates/certificate.status.enum';
import { CarbonCertificateEntity } from '../../entities/carbon-certificate.entity';

export class CarbonCertificatesFactory extends CarbonCertificateEntity {
  @Factory((faker) => faker.address.country())
  country: string;

  @Factory((faker, ctx) => ctx.status ?? CertificateStatusEnum.available)
  status: CertificateStatusEnum;

  @Factory((faker, ctx) => ctx.ownerId ?? null)
  ownerId = null;
}
