import { UserDocument, User } from '../schemas/user.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findOne(filter: object): Promise<User> {
    return this.userModel.findOne(filter).lean();
  }

  async find(userFilterQuery: FilterQuery<User>): Promise<User[]> {
    return this.userModel.find(userFilterQuery).lean();
  }

  async create(usr: User): Promise<User> {
    const user = new this.userModel(usr);
    return user.save();
  }

  async findOneAndUpdate(
    userFilterQuery: FilterQuery<User>,
    user: Partial<User>,
  ): Promise<User> {
    return this.userModel.findOneAndUpdate(userFilterQuery, user).lean();
  }

  async getAllUsers(): Promise<User[]> {
    return this.userModel.find().lean();
  }
}
