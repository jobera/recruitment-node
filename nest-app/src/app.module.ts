import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CertificatesModule } from './certificates/certificates.module';
import { DatabaseProviderModule } from './providers/database/provider.module';

@Module({
  imports: [DatabaseProviderModule, AuthModule, CertificatesModule],
})
export class AppModule {}
