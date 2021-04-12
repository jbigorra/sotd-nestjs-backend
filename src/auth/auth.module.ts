import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/user/user.module';
import { AuthServiceProvider } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthController } from './controllers/auth.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: 'DEVELOPMENT_SECRET_KEY',
      signOptions: {
        expiresIn: '60s',
      },
    }),
  ],
  exports: [AuthServiceProvider, JwtModule],
  providers: [AuthServiceProvider, LocalStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
