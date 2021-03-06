import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import * as randomToken from 'rand-token';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user) {
      const obj = bcrypt.compareSync(pass, user.password);
      if (obj) {
        const { password, ...rest } = user;
        return rest;
      }
      return null;
    } else {
      return null;
    }
  }

  async getJwtToken(user: any) {
    const payload = {
      username: user.username,
      sub: user['_id'].toString(),
      role: user.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async registerUser(userData: any) {
    return this.usersService.createUser(userData);
  }

  async getRefreshToken(userId: string): Promise<string> {
    const token = {
      name: randomToken.generate(10),
    };
    const refreshToken = this.jwtService.sign(token, {
      secret: jwtConstants.SECRET_REFRESH_TOKEN_KEY,
      expiresIn: jwtConstants.SECRET_REFRESH_EXPIRED_TIME,
    });

    await this.usersService.findOneByUserIdAndUpdatToken(userId, refreshToken);
    return refreshToken;
  }

  async logout(id: string): Promise<any> {
    return this.usersService.logoutUser(id);
  }
}
