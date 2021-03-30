import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { IUser } from '../domain/models/user.model';
import { IUserRepository, IUserRepositoryToken } from '../persistence/file-base-user.repository';

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

  @Get(':id')
  get(@Param('id') id: number): Observable<UserInfoResponse> {
    return of({ id, username: 'jbigorra', email: 'juanchoibf@gmail.com' });
  }

  @Post('/signup')
  signup(@Body() body: ISignUpRequest): Observable<UserInfoResponse> {
    const { passwordConfirmation, ...rest } = body;
    return this.userRepository.add(rest as IUser).pipe(
      map((user: IUser) => {
        const { password, ...rest } = user;
        return rest as UserInfoResponse;
      })
    );
  }
}
