import { Controller } from '@nestjs/common';
import { CertificateService } from './certificates.service';

@Controller('api/v1/certificates')
export class CertificateController {
  constructor(private readonly certificateService: CertificateService) {}

  getAll(): [] {
    return [];
  }
}
