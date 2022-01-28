import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRepository } from './repositories/users.repository';
import { BlacklistRepository } from './repositories/blacklist.repository';
import { RoleRepository } from './repositories/role.repository';
import { Role } from './roles/role.enum';
import { Types } from 'mongoose';

export type User = {
  username: string;
  password: string;
  role: string;
  email: string;
  refresh_token: string;
};

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UserRepository,
    private readonly blacklistRepository: BlacklistRepository,
    private readonly roleRepository: RoleRepository,
  ) {}

  async createUser(userData: any): Promise<User> {
    const username = userData.username;
    const email = userData.email;
    let role = '';
    if (userData.isAdmin) {
      role = Role.Admin;
    } else {
      role = Role.User;
    }
    const refresh_token = '';
    let password = userData.password;
    const salt = bcrypt.genSaltSync(5);
    password = bcrypt.hashSync(password, salt);

    return this.usersRepository.create({
      username,
      email,
      password,
      role,
      refresh_token,
    });
  }

  async findOne(username: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ username: username });
  }

  async findOneAndUpdate(filter: any, updates: any): Promise<User | undefined> {
    return this.usersRepository.findOneAndUpdate(filter, updates);
  }

  async getAllUsers(): Promise<User[] | undefined> {
    return this.usersRepository.getAllUsers();
  }

  async getUserByRefreshToken(refToken: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ refresh_token: refToken });
  }

  async getUserData(userId: string): Promise<User> {
    return this.usersRepository.findOne({ id: userId });
  }

  async logoutUser(userId: string): Promise<any> {
    const user = await this.usersRepository.findOne({ id: userId });
    await this.blacklistRepository.create({
      refresh_token: user.refresh_token,
    });

    return this.usersRepository.findOneAndUpdate(
      { _id: new Types.ObjectId(userId) },
      { refresh_token: '' },
    );
  }

  async findOneByUserIdAndUpdatToken(
    userId: string,
    refToken: string,
  ): Promise<any> {
    const obj = new Types.ObjectId(userId);
    return this.usersRepository.findOneAndUpdate(
      { _id: obj },
      { refresh_token: refToken },
    );
  }

  async deleteRoles(ids: object): Promise<any> {
    return this.roleRepository.deleteManyRoles(ids);
  }

  async createRole(name: string): Promise<any> {
    return this.roleRepository.create({ name: name });
  }

  async getTokenFromBlacklist(token: string): Promise<any> {
    return this.blacklistRepository.findOne({ refresh_token: token });
  }

  async deleteUsers(ids: object): Promise<any> {
    return this.usersRepository.deleteManyUsers(ids);
  }
}
