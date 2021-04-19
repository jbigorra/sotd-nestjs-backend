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

  async validateUser(email: string, pass: string): Promise<ValidatedUser> {
    return this.userRepository.findByEmail(email).pipe(
      map((user) => {
        if (user.password === pass) {
          const { password, ...rest } = user;
          return rest;
        }
        throw new UnauthorizedException();
      }),
    ).toPromise();
  }

  login(user: ValidatedUser): Promise<JwtAuthUser> {
    const payload = { user, sub: user.id };

    return this.jwtService.signAsync(payload).then(
      (jwtString) => ({ accessToken: jwtString }),
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
