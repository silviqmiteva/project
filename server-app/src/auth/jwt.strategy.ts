import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { BadRequestException, Injectable } from '@nestjs/common';
import { jwtConstants } from './constants';
import { Request } from 'express';
import { TokenService } from './jwt.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private tokenService: TokenService) {
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
      verifyAccessToken = await this.tokenService.verifyToken(
        accessToken,
        jwtConstants.SECRET_ACCESS_TOKEN_KEY,
      );
      if (verifyAccessToken) {
        return {
          id: payload.sub,
          username: payload.username,
          role: payload.role,
        };
      }
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        const refreshToken = req?.cookies['refresh_token'];
        if (!refreshToken) {
          throw new BadRequestException('no refresh token provided');
        }
        try {
          verifyRefreshToken = await this.tokenService.verifyToken(
            refreshToken,
            jwtConstants.SECRET_REFRESH_TOKEN_KEY,
          );
          if (verifyRefreshToken) {
            const user = await this.tokenService.generateNewTokens(
              refreshToken,
            );
            return user;
          }
        } catch (err) {
          if (err.name === 'TokenExpiredError') {
            console.log('refresh token expired');
          }
          throw err;
        }
      } else {
        throw err;
      }
    }
  }
}
