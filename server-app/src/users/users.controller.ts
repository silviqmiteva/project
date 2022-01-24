import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
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
  createRole(@Req() req): any {
    const role = req.body;
    return this.userService.createRole(role.name);
  }
}
