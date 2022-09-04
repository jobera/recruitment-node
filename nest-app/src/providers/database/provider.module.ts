import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarbonCertificateEntity } from '../../entities/carbon-certificate.entity';
import { UserEntity } from '../../entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'agreenaDB.sqlite',
      entities: [UserEntity, CarbonCertificateEntity],
      synchronize: true,
    }),
  ],
})
export class DatabaseProviderModule {}
