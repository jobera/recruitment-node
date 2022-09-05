import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { JwtPayload, JwtResponse } from './module';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'get-secret-or-key-from-config-file',
    });
  }

  async validate(payload: JwtPayload): Promise<JwtResponse> {
    return {
      userId: payload.sub,
      email: payload.email,
    };
  }
}
