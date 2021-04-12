import { Controller, Request, Post, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from 'src/Guards/local-auth.guard';
import { ValidatedUser } from '../auth.service';

@Controller('auth')
export class AuthController {
  @UseGuards(LocalAuthGuard)
  @Post('/signin')
  login(@Request() req: { user: ValidatedUser }) : ValidatedUser {
    return req.user;
  }
}
