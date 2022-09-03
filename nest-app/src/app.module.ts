import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CertificateModule } from './certificates/certificates.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    CertificateModule,
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
