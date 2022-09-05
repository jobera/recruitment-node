import { seeder } from 'nestjs-seeder';
import { UsersSeeder } from './seeders/users.seeder';
import { DatabaseProviderModule } from './providers/database/provider.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { CarbonCertificateEntity } from './entities/carbon-certificate.entity';
import { CarbonCertificatesSeeder } from './seeders/carbon-certificates.seeder';

seeder({
  imports: [
    DatabaseProviderModule,
    TypeOrmModule.forFeature([UserEntity, CarbonCertificateEntity]),
  ],
}).run([CarbonCertificatesSeeder, UsersSeeder]);
