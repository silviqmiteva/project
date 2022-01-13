import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppGateway } from './app.gateway';
import { UsersModule } from './users/users.module';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './auth/constants';
import { JwtStrategy } from './auth/jwt.strategy';
@Module({
  imports: [
    UsersModule,
    AuthModule,
    JwtModule.register({
      secret: jwtConstants.SECRET_ACCESS_TOKEN_KEY,
      signOptions: { expiresIn: jwtConstants.SECRET_ACCESS_EXPIRED_TIME },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, AppGateway, AuthService, JwtStrategy],
})
export class AppModule {}
