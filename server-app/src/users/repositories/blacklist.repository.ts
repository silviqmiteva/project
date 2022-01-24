import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlackList, BlackListDocument } from '../schemas/blacklist.schema';

@Injectable()
export class BlacklistRepository {
  constructor(
    @InjectModel(BlackList.name)
    private blacklistModel: Model<BlackListDocument>,
  ) {}

  async create(token: BlackList): Promise<BlackList> {
    const tokens = new this.blacklistModel(token);
    return tokens.save();
  }

  async findOne(filter: object): Promise<BlackList> {
    return this.blacklistModel.findOne(filter).lean();
  }
}
