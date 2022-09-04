import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserEntity } from 'src/entities/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    // @note Change defualt 'username' attribute to 'email'
    super({ usernameField: 'email' });
  }

  async validate(
    email: string,
    password: string,
  ): Promise<Partial<UserEntity>> {
    try {
      return await this.authService.validateUser(email, password);
    } catch (error: unknown) {
      throw new UnauthorizedException();
    }
  }
}
