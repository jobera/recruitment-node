import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Put,
  Query,
  Request,
  UnauthorizedException,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { CarbonCertificateEntity } from '../entities/carbon-certificate.entity';
import { CertificatesService } from './certificates.service';
import { Pagination } from 'nestjs-typeorm-paginate';
import { CertificateStatusEnum } from './certificate.status.enum';
import { OptionalJwtAuthGuard } from '../auth/optional-auth.guard';
import { CertificatesFilterDto } from './dto/certificates.filter.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CertificatesTransferDto } from './dto/certificates.transfer.dto';
import { UsersService } from '../users/users.service';

@Controller('api/v1/certificates')
export class CertificateController {
  constructor(
    private readonly certificatesService: CertificatesService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(OptionalJwtAuthGuard)
  @Get()
  getAll(
    @Request() { user },
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Query(new ValidationPipe({ transform: true, whitelist: true }))
    { status = [CertificateStatusEnum.available] }: CertificatesFilterDto,
  ): Promise<Pagination<CarbonCertificateEntity>> {
    // Get carbon certificiagtes by owner when requesting by 'owned|transferred'
    const ownerId =
      !status.includes(CertificateStatusEnum.available) && user
        ? user.userId
        : null;

    return this.certificatesService.getAll(
      {
        page,
        limit,
      },
      { status, ownerId },
    );
  }

  @UseGuards(JwtAuthGuard)
  @Put('/transfer/')
  async transferCertificateOwnership(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    { userId, certificateId }: CertificatesTransferDto,
    @Request() { user },
  ) {
    const certificate = await this.certificatesService.getOne(certificateId);

    await this.validateCertificateTransfer(certificate, user.userId, userId);

    // Transfer certificate ownership
    await this.certificatesService.transferCertificateOwnership(
      certificateId,
      user.userId, // Authed user - current owner
      userId, // Requested transfer owner
    );

    return this.certificatesService.getOne(certificateId);
  }

  private async validateCertificateTransfer(
    certificate: CarbonCertificateEntity,
    ownerId: number,
    newOwnerId: number,
  ): Promise<void> {
    // @note Check if certficate is valid and belongs to authed user
    if (!certificate || certificate.ownerId != ownerId) {
      throw new UnauthorizedException(
        'Certificate unavailable for authenticated user',
      );
    }

    // @note Check if requested user is authed user
    if (certificate.ownerId === newOwnerId) {
      throw new UnauthorizedException(
        'Requested user to transfer is already owner of this certificate',
      );
    }

    // @note Check requested user is valid
    if (!(await this.usersService.getOne(newOwnerId))) {
      throw new UnauthorizedException(
        'Requested user to receive certificate ownership does not exists',
      );
    }
  }
}
