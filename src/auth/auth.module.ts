import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/user/user.module';
import { AuthServiceProvider } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthController } from './controllers/auth.controller';

@Module({
  imports: [UserModule, PassportModule],
  providers: [AuthServiceProvider, LocalStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
