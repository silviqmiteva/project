import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role, RoleDocument } from '../schemas/role.schema';

@Injectable()
export class RoleRepository {
  constructor(
    @InjectModel(Role.name)
    private roleModel: Model<RoleDocument>,
  ) {}

  async create(role: Role): Promise<Role> {
    const newRole = new this.roleModel(role);
    return newRole.save();
  }

  async deleteManyRoles(obj: object): Promise<any> {
    return this.roleModel.deleteMany({ _id: { $in: obj['rolesId'] } }).lean();
  }
}
