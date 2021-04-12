import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  IUserRepository,
  IUserRepositoryToken,
} from 'src/user/persistence/file-based-user.repository';

export const IAuthServiceToken = "IAUTH_SERVICE_TOKEN";

export interface IAuthService {
  validateUser(email: string, pass: string): Observable<ValidatedUser>
}

@Injectable()
export class AuthService {

  @Inject(IUserRepositoryToken) private readonly userRepository: IUserRepository;

  validateUser(email: string, pass: string): Observable<ValidatedUser> {
    return this.userRepository
      .findByEmail(email)
      .pipe(
        map((user) => {
          if (user.password === pass) {
            const { password, ...rest } = user;
            return rest;
          }
          throw new UnauthorizedException();
        }),
      );
  }
}

export interface ValidatedUser {
  id: number;
  username: string;
  email: string;
}

export const AuthServiceProvider = {
  provide: IAuthServiceToken,
  useClass: AuthService
};
