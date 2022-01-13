import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { BadRequestException, Injectable } from '@nestjs/common';
import { jwtConstants } from './constants';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
    private jwtService: JwtService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      passReqToCallback: true,
      secretOrKey: jwtConstants.SECRET_ACCESS_TOKEN_KEY,
    });
  }
  async validate(req: Request, payload: any) {
    let accessToken = req.headers.authorization;
    accessToken = accessToken.slice(7, accessToken.length);
    let verifyAccessToken, verifyRefreshToken;
    try {
      verifyAccessToken = this.jwtService.verify(accessToken, {
        secret: jwtConstants.SECRET_ACCESS_TOKEN_KEY,
      });
      if (verifyAccessToken) {
        return {
          id: payload.sub,
          username: payload.username,
          roles: payload.roles,
        };
      }
    } catch (err) {
      if (err) {
        console.log(err);
      }
      if (err.name === 'TokenExpiredError') {
        const refreshToken = req?.cookies['refresh_token']; //get refersh_token from cookie
        if (!refreshToken) {
          throw new BadRequestException('no refresh token provided');
        }
        try {
          verifyRefreshToken = this.jwtService.verify(refreshToken, {
            secret: jwtConstants.SECRET_REFRESH_TOKEN_KEY,
          });
          if (verifyRefreshToken) {
            const user = await this.userService.getUserByRefreshToken(
              refreshToken,
            );
            if (user) {
              //generate new access and refresh token
              const newAccessToken = await this.authService.getJwtToken(user);
              const newRefreshToken = await this.authService.getRefreshToken(
                user.id,
              );
              user.newAccessToken = newAccessToken.access_token;
              user.newRefreshToken = newRefreshToken;
            } else {
              throw new BadRequestException('refresh token is invalid');
            }

            return user;
          }
        } catch (err) {
          if (err.name === 'TokenExpiredError') {
            console.log('refresh token expired');
          }
          throw err;
        }
      }
      throw err;
    }
  }
}
