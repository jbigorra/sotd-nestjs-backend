import { Body, Controller, Get, Inject, Param, Post, Request, UseGuards } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ValidatedUser } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/Guards/jwt-auth.guard';
import { IUserModel } from '../domain/models/user.model';
import { IUserRepository, IUserRepositoryToken } from '../persistence/file-based-user.repository';

interface ISignUpRequest {
  username: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

interface UserInfoResponse {
  id: number,
  username: string;
  email: string;
}

@Controller('user')
export class UserController {

  @Inject(IUserRepositoryToken) private readonly userRepository: IUserRepository;

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  get(@Request() req: { user: ValidatedUser }): Observable<UserInfoResponse> {
    return of(req.user);
  }

  @Post('/signup')
  signup(@Body() body: ISignUpRequest): Observable<UserInfoResponse> {
    const { passwordConfirmation, ...rest } = body;
    return this.userRepository.add(rest as IUserModel).pipe(
      map((user: IUserModel) => {
        const { password, ...rest } = user;
        return rest as UserInfoResponse;
      })
    );
  }
}
