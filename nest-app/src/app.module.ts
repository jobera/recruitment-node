import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CertificatesModule } from './certificates/certificates.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    AuthModule,
    CertificatesModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'agreenaDB.sqlite',
      entities: [__dirname + '/entities/*.entity{.ts,.js}'],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
