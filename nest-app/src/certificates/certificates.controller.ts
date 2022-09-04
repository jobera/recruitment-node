import {
  Controller,
  DefaultValuePipe,
  Get,
  ParseEnumPipe,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { CarbonCertificateEntity } from '../entities/carbon-certificate.entity';
import { CertificateService } from './certificates.service';
import { Pagination } from 'nestjs-typeorm-paginate';
import { CertificateStatusEnum } from './certificate.status.enum';

@Controller('api/v1/certificates')
export class CertificateController {
  constructor(private readonly certificateService: CertificateService) {}

  @Get()
  getAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Query('status', new ParseEnumPipe(CertificateStatusEnum))
    status = CertificateStatusEnum.available,
  ): Promise<Pagination<CarbonCertificateEntity>> {
    return this.certificateService.getAll(
      {
        page,
        limit,
      },
      { status },
    );
  }
}
