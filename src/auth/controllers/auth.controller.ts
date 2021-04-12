import { Controller, Request, Post, UseGuards, Inject } from '@nestjs/common';
import { Observable } from 'rxjs';
import { LocalAuthGuard } from 'src/Guards/local-auth.guard';
import { IAuthService, IAuthServiceToken, JwtAuthUser, ValidatedUser } from '../auth.service';

@Controller('auth')
export class AuthController {

  @Inject(IAuthServiceToken) private readonly authService: IAuthService;

  @UseGuards(LocalAuthGuard)
  @Post('/signin')
  login(@Request() req: { user: ValidatedUser }) : Observable<JwtAuthUser> {
    return this.authService.login(req.user);
  }
}
