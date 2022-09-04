import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AccessToken, JwtPayload } from './module';
import { ConflictException, Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwt: JwtService,
  ) {}

  async signup(user: Partial<UserEntity>): Promise<Partial<UserEntity>> {
    if (await this.userRepository.findOne({ where: { email: user.email } })) {
      throw new ConflictException('User already exists');
    }

    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(user.password, salt);
    const { password, ...userDetails } = await this.userRepository.save(user);
    return userDetails;
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<Partial<UserEntity> | null> {
    const user = await this.userRepository.findOneOrFail({ where: { email } });

    if (await bcrypt.compare(password, user.password)) {
      const { password, ...userDetails } = user;
      return userDetails;
    }

    return null;
  }

  async login({ id, email }: Partial<UserEntity>): Promise<AccessToken> {
    const payload: JwtPayload = { email, sub: id };
    return {
      accessToken: this.jwt.sign(payload),
    };
  }
}
