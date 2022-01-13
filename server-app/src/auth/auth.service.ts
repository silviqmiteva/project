import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import * as randomToken from 'rand-token';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user) {
      const obj = bcrypt.compare(pass, user.password).then((res) => {
        if (res) {
          const { password, ...rest } = user;
          console.log(rest);
          return rest;
        } else {
          return null;
        }
      });
      return obj;
    } else {
      return null;
    }
  }

  async getJwtToken(user: any) {
    const payload = {
      username: user.username,
      sub: user.id,
      roles: user.roles,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async registerUser(userData: any) {
    return this.usersService.createUser(userData);
  }

  async getRefreshToken(userId: number): Promise<string> {
    const token = {
      name: randomToken.generate(10),
    };
    const refreshToken = this.jwtService.sign(token, {
      secret: jwtConstants.SECRET_REFRESH_TOKEN_KEY,
      expiresIn: jwtConstants.SECRET_REFRESH_EXPIRED_TIME,
    });

    await this.usersService.updateRefreshToken(userId, refreshToken); // update user token in db/arr
    return refreshToken;
  }

  logout(id: number) {
    this.usersService.logoutUser(id);
  }
}
