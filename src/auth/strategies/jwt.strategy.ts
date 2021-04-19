import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ValidatedUser } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'DEVELOPMENT_SECRET_KEY'
    });
  }

  async validate(payload: { user: ValidatedUser, sub: Number }) : Promise<ValidatedUser> {
    console.log(payload);
    return payload.user;
  }
}
