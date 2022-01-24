import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';

@Injectable()
export class TokenService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private authService: AuthService,
  ) {}

  async verifyToken(token: string, key: string): Promise<any> {
    return this.jwtService.verify(token, {
      secret: key,
    });
  }

  async generateNewTokens(refreshToken: string): Promise<any> {
    const tokenInBlacklist = await this.userService.getTokenFromBlacklist(
      refreshToken,
    );
    const user = await this.userService.getUserByRefreshToken(refreshToken);
    if (user && !tokenInBlacklist) {
      const newAccessToken = await this.authService.getJwtToken(user);
      const newRefreshToken = await this.authService.getRefreshToken(
        user['_id'].toString(),
      );
      user['newAccessToken'] = newAccessToken.access_token;
      user['newRefreshToken'] = newRefreshToken;
    } else {
      throw new BadRequestException('refresh token is invalid');
    }
    return user;
  }
}
