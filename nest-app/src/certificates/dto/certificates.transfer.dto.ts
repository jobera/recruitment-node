import { IsNumber } from 'class-validator';

export class CertificatesTransferDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  certificateId: number;
}
