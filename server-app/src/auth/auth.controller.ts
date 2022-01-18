import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  Res,
  Get,
  Put,
} from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/createUserDto.dto';
import { Response } from 'express';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Res({ passthrough: true }) res: Response) {
    const data = await this.authService.getJwtToken(req.user);
    const refreshToken = await this.authService.getRefreshToken(req.user.id);
    res.cookie('refresh_token', refreshToken, { httpOnly: true }); //use refresh token here
    return { message: 'success', access_token: data.access_token }; //return access token to client
  }

  @Post('register')
  register(@Body() createUserDto: CreateUserDto): any {
    console.log('user data ', createUserDto);
    return this.authService.registerUser(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('test')
  test(@Request() req, @Res({ passthrough: true }) res: Response) {
    const obj = req.body.test;
    const data = {};
    if (req.user.newRefreshToken && req.user.newAccessToken) {
      res.cookie('refresh_token', req.user.newRefreshToken, { httpOnly: true }); //use refresh token here
      data['access_token'] = req.user.newAccessToken;
    }
    data['text'] = 'this is test protected route ' + obj;
    return data;
  }

  @UseGuards(JwtAuthGuard)
  @Put('logout')
  logout(@Request() req): any {
    this.authService.logout(req.body.userId);
    return { message: 'user logout' };
  }
}
