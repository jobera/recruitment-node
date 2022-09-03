export interface CertificateDto {
  id: number;
  countryId: number;
  status: CertificateStatusEnum;
  ownerId: number | null;
}

export enum CertificateStatusEnum {
  available = 'available',
  owned = 'owned',
  transferred = 'transferred',
}
