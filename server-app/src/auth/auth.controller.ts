import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  Res,
  Put,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/createUserDto.dto';
import { Response } from 'express';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() user: object, @Res({ passthrough: true }) res: Response) {
    if (!user || !user['username'] || !user['password']) {
      throw new BadRequestException();
    }
    const userExists = await this.authService.validateUser(
      user['username'],
      user['password'],
    );
    if (!userExists) {
      throw new UnauthorizedException();
    }
    const data = await this.authService.getJwtToken(userExists);
    const userId = userExists['_id'].toString();
    const refreshToken = await this.authService.getRefreshToken(userId);
    res.cookie('refresh_token', refreshToken, { httpOnly: true });
    return {
      message: 'success',
      access_token: data.access_token,
      id: userId,
      username: user['username'],
    };
  }

  @Post('register')
  register(@Body() createUserDto: CreateUserDto): any {
    if (
      !createUserDto ||
      !createUserDto.username ||
      !createUserDto.password ||
      !createUserDto.email
    ) {
      throw new BadRequestException();
    }
    return this.authService.registerUser(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('test')
  test(@Request() req, @Res({ passthrough: true }) res: Response) {
    const obj = req.body.test;
    if (!obj) {
      throw new BadRequestException();
    }
    const data = {};
    if (req.user && req.user.newRefreshToken && req.user.newAccessToken) {
      res.cookie('refresh_token', req.user.newRefreshToken, { httpOnly: true });
      data['access_token'] = req.user.newAccessToken;
    }
    data['text'] = 'this is test protected route ' + obj;
    return data;
  }

  @UseGuards(JwtAuthGuard)
  @Put('logout')
  async logout(@Body() user: object): Promise<any> {
    if (!user || !user['userId']) {
      throw new BadRequestException();
    }
    return this.authService.logout(user['userId']);
  }
}
