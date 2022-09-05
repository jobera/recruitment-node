import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { CarbonCertificateEntity } from '../entities/carbon-certificate.entity';
import { UserEntity } from '../entities/user.entity';
import { CertificateController } from './certificates.controller';
import { CertificatesService } from './certificates.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, CarbonCertificateEntity]),
    UsersModule,
  ],
  controllers: [CertificateController],
  providers: [CertificatesService],
})
export class CertificatesModule {}
