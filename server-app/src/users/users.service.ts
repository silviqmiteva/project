import { Injectable } from '@nestjs/common';

export type User = {
  id: number;
  username: string;
  password: string;
  salt: string;
};

@Injectable()
export class UsersService {
  private readonly users: User[] = [
    {
      id: 1,
      username: 'ivan',
      password: '$2b$05$o0srWG7oILhbzxmhz.ogYugjdvXL55hizisOBaOdm0VwUA87O1Wz2', // bcrypt.hash(plainPassword, salt)
      salt: '$2b$05$o0srWG7oILhbzxmhz.ogYu', // salt - generated and saved on user register bcrypt.genSalt(5).toString()
    },
    {
      id: 2,
      username: 'qsen',
      password: '$2b$05$FhCjO1c1Yte8mpb.LZFVRuBw9DFnin10ykKmEk2yVxyZYsiIJpt9S',
      salt: '$2b$05$FhCjO1c1Yte8mpb.LZFVRu',
    },
  ];

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.username === username);
  }
}
