import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  IUserRepository,
  IUserRepositoryToken,
} from 'src/user/persistence/file-based-user.repository';

export const IAuthServiceToken = 'IAUTH_SERVICE_TOKEN';

export interface IAuthService {
  validateUser(email: string, pass: string): Observable<ValidatedUser>;
  login(user: ValidatedUser): Observable<JwtAuthUser>;
}

@Injectable()
export class AuthService {
  @Inject(IUserRepositoryToken)
  private readonly userRepository: IUserRepository;
  @Inject() private readonly jwtService: JwtService;

  validateUser(email: string, pass: string): Observable<ValidatedUser> {
    return this.userRepository.findByEmail(email).pipe(
      map((user) => {
        if (user.password === pass) {
          const { password, ...rest } = user;
          return rest;
        }
        throw new UnauthorizedException();
      }),
    );
  }

  login(user: ValidatedUser): Observable<JwtAuthUser> {
    const { id } = user;
    const payload = { user, sub: id };

    return from(this.jwtService.signAsync(payload)).pipe(
      map(
        (jwtString) =>
          ({
            accessToken: jwtString,
          } as JwtAuthUser),
      ),
    );
  }
}

export interface ValidatedUser {
  id: number;
  username: string;
  email: string;
}

export interface JwtAuthUser {
  accessToken: string;
}

export const AuthServiceProvider = {
  provide: IAuthServiceToken,
  useClass: AuthService,
};
