import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Observable, of } from 'rxjs';

interface ISignUpRequest {
  username: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

interface UserInfoResponse {
  id: string,
  username: string;
  email: string;
}

@Controller('user')
export class UserController {
  @Get(':id')
  get(@Param('id') id: string): Observable<UserInfoResponse> {
    return of({ id, username: 'jbigorra', email: 'juanchoibf@gmail.com' });
  }

  @Post('/signup')
  signup(@Body() body: ISignUpRequest): Observable<UserInfoResponse> {
    return of({ id: '123-123-123', username: 'jbigorra', email: 'juanchoibf@gmail.com' });
  }
}
