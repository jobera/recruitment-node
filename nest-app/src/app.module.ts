import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CertificatesModule } from './certificates/certificates.module';
import { DatabaseProviderModule } from './providers/database/provider.module';

@Module({
  imports: [DatabaseProviderModule, AuthModule, CertificatesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
