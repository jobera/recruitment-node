import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Seeder, DataFactory } from 'nestjs-seeder';
import { UserEntity } from '../entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CarbonCertificatesSeeder } from './carbon-certificates.seeder';
import { UsersFactory } from './factory/users.factory';

@Injectable()
export class UsersSeeder implements Seeder {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
    private readonly carbonCertificatesSeeder: CarbonCertificatesSeeder,
  ) {}

  async seed(): Promise<void> {
    await this.createOwnerUsers(5);
    await this.createRandomUsers(5);
  }

  async drop(): Promise<void> {
    await this.repository.clear();
    await this.repository.query(
      'DELETE FROM sqlite_sequence WHERE name = "user_entity"',
    );
  }

  private async createOwnerUsers(total: number) {
    for (let userId = 1; userId <= total; userId++) {
      await this.createUser({
        id: userId,
        email: `owner-user-${userId}@example.com`,
        password: `password${userId}`,
      });
      await this.carbonCertificatesSeeder.generateOwnedCertificate(userId);
    }
  }

  private async createRandomUsers(total: number) {
    const salt = await bcrypt.genSalt();
    const password = await bcrypt.hash('password', salt);

    const users = DataFactory.createForClass(UsersFactory).generate(total, {
      password,
    });
    await this.repository.save(users);
  }

  private async createUser(user: Partial<UserEntity>) {
    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(user.password, salt);
    await this.repository.save(user);
  }
}
