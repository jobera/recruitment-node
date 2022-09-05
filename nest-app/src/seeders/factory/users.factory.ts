import { UserEntity } from '../../entities/user.entity';
import { Factory } from 'nestjs-seeder';
import * as bcrypt from 'bcrypt';

export class UsersFactory extends UserEntity {
  @Factory((faker) => faker.internet.email())
  email: string;

  @Factory((faker, ctx) => ctx.password ?? null)
  password: string;
}
