import {
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { CarbonCertificateEntity } from '../entities/carbon-certificate.entity';
import { CertificateService } from './certificates.service';
import { Pagination } from 'nestjs-typeorm-paginate';

@Controller('api/v1/certificates')
export class CertificateController {
  constructor(private readonly certificateService: CertificateService) {}

  @Get()
  getAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ): Promise<Pagination<CarbonCertificateEntity>> {
    return this.certificateService.getAll({
      page,
      limit,
    });
  }
}
