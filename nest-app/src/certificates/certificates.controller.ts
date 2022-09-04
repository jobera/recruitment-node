import {
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Query,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { CarbonCertificateEntity } from '../entities/carbon-certificate.entity';
import { CertificateService } from './certificates.service';
import { Pagination } from 'nestjs-typeorm-paginate';
import { CertificateStatusEnum } from './certificate.status.enum';
import { OptionalJwtAuthGuard } from '../auth/optional-auth.guard';
import { CarbonCertificatePaginationFilter } from './dto/certificates.filter.dto';

@Controller('api/v1/certificates')
export class CertificateController {
  constructor(private readonly certificateService: CertificateService) {}

  @UseGuards(OptionalJwtAuthGuard)
  @Get()
  getAll(
    @Request() { user },
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Query(new ValidationPipe({ transform: true }))
    {
      status = [CertificateStatusEnum.available],
    }: CarbonCertificatePaginationFilter,
  ): Promise<Pagination<CarbonCertificateEntity>> {
    console.log(status);
    // Get carbon certificiagtes by owner when requesting by 'owned|transferred'
    const ownerId =
      !status.includes(CertificateStatusEnum.available) && user
        ? user.userId
        : null;

    return this.certificateService.getAll(
      {
        page,
        limit,
      },
      { status, ownerId },
    );
  }
}
