import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, Logger, LoggerService } from '@nestjs/common';
import { IAuthService, IAuthServiceToken, ValidatedUser } from './../auth.service';
import { Observable } from 'rxjs';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {

  @Inject(IAuthServiceToken) private readonly authService: IAuthService;

  constructor() {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  validate(email: string, password: string): Observable<ValidatedUser> {
    return this.authService.validateUser(email, password);
  }
}
