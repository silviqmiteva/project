import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Role } from './roles/role.enum';
import { Roles } from '../users/roles/roles.decorator';
import { RolesGuard } from '../users/roles/roles.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  // if admin allow access
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  getAll(): any {
    return this.userService.getAllUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req): any {
    return this.userService.getUserData(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('role')
  createRole(@Body() obj: object): any {
    const role = obj['name'];
    if (!role) {
      throw new BadRequestException();
    }
    return this.userService.createRole(role);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/delete')
  deleteUsers(@Body() obj: object): any {
    if (!obj || !obj['usersId']) {
      throw new BadRequestException();
    }
    return this.userService.deleteUsers(obj);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('role/delete')
  deleteRoles(@Body() obj: object): any {
    if (!obj || !obj['rolesId']) {
      throw new BadRequestException();
    }
    return this.userService.deleteRoles(obj);
  }
}
