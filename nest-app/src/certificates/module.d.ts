import { CertificateStatusEnum } from './certificate.status.enum';

export interface CertificateDto {
  id: number;
  countryId: number;
  status: CertificateStatusEnum;
  ownerId: number | null;
}

export interface CarbonCertificatePaginationFilter {
  status: CertificateStatusEnum;
}
