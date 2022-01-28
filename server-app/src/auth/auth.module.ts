import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { RolesGuard } from '../users/roles/roles.guard';
import { TokenService } from './jwt.service';

@Module({
  imports: [
    PassportModule,
    UsersModule,
    JwtModule.register({
      secret: jwtConstants.SECRET_ACCESS_TOKEN_KEY,
      signOptions: { expiresIn: jwtConstants.SECRET_ACCESS_EXPIRED_TIME },
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    RolesGuard,
    TokenService,
  ],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
