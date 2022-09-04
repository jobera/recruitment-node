import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarbonCertificateEntity } from '../entities/carbon-certificate.entity';
import { UserEntity } from '../entities/user.entity';
import { CertificateController } from './certificates.controller';
import { CertificatesService } from './certificates.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, CarbonCertificateEntity])],
  controllers: [CertificateController],
  providers: [CertificatesService],
})
export class CertificatesModule {}
