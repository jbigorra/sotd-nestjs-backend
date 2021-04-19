import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/user/user.module';
import { AuthServiceProvider } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthController } from './controllers/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: 'DEVELOPMENT_SECRET_KEY',
      signOptions: {
        expiresIn: '1h',
      },
    }),
  ],
  exports: [AuthServiceProvider, JwtModule],
  providers: [AuthServiceProvider, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
