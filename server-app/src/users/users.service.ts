import { Injectable } from '@nestjs/common';
import { Role } from './role.enum';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';

export type User = {
  id: number;
  username: string;
  password: string;
  roles: Role[];
  email: string;
  refresh_token: string;
};

@Injectable()
export class UsersService {
  private users: User[] = [
    {
      id: 1,
      username: 'ivan',
      password: '$2b$05$o0srWG7oILhbzxmhz.ogYugjdvXL55hizisOBaOdm0VwUA87O1Wz2', // bcrypt.hash(plainPassword, salt)
      roles: [Role.User],
      email: 'ivan@gmail.com',
      refresh_token: '',
    },
    {
      id: 2,
      username: 'qsen',
      password: '$2b$05$FhCjO1c1Yte8mpb.LZFVRuBw9DFnin10ykKmEk2yVxyZYsiIJpt9S',
      roles: [Role.Admin],
      email: 'qsen@gmail.com',
      refresh_token: '',
    },
  ];

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.username === username);
  }

  getAllUsers() {
    return this.users;
  }

  getUserData(user: any) {
    const obj = this.users.find((el) => el.id === user.id);
    const { password, ...rest } = obj;
    return rest;
  }

  createUser(user: {
    username: any;
    email: any;
    id: any;
    password: any;
    roles: any;
    refresh_token: any;
  }) {
    const usernameExists = this.users.find(
      (el) => el.username === user.username,
    );
    if (usernameExists) {
      return { error: 'Account with this username already exists' };
    }
    const emailExists = this.users.find((el) => el.email === user.email);
    if (emailExists) {
      return { error: 'Account with this email already exists' };
    }
    const id = this.users[this.users.length - 1].id;
    user.id = id + 1;
    const salt = bcrypt.genSaltSync(5);
    user.password = bcrypt.hashSync(user.password, salt);
    user.roles = ['user'];
    user.refresh_token = {};
    this.users.push(user);
    return { message: 'success' };
  }

  async updateRefreshToken(id: number, refresh_token: string) {
    const user = this.users.find((el) => el.id === id);
    user.refresh_token = refresh_token;
  }

  async getUserByRefreshToken(refToken: string): Promise<any> {
    const user = this.users.find((el) => el.refresh_token === refToken);
    const { password, ...rest } = user;
    return rest;
  }

  logoutUser(id: number) {
    const userInd = this.users.findIndex((el) => el.id === id);
    fs.appendFile(
      'blacklist.txt',
      this.users[userInd].refresh_token + ';',
      (err) => {
        if (err) throw err;
        this.users[userInd].refresh_token = '';
      },
    );
  }
}
