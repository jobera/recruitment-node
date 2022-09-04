import { Transform, Type } from 'class-transformer';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { CertificateStatusEnum } from '../certificate.status.enum';

export class CarbonCertificatePaginationFilter {
  @IsOptional()
  @IsString({ each: true })
  @IsArray()
  @Type(() => String)
  @IsEnum(CertificateStatusEnum, { each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  status?: CertificateStatusEnum[];
}
