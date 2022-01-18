import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from './schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UserRepository } from './repositories/users.repository';
import { BlackList, BlackListSchema } from './schemas/blacklist.schema';
import { BlacklistRepository } from './repositories/blacklist.repository';
import { RoleRepository } from './repositories/role.repository';
import { Role, RoleSchema } from './schemas/role.schema';

@Module({
  providers: [
    UsersService,
    UserRepository,
    BlacklistRepository,
    RoleRepository,
  ],
  exports: [UsersService],
  controllers: [UsersController],
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: BlackList.name, schema: BlackListSchema },
      { name: Role.name, schema: RoleSchema },
    ]),
  ],
})
export class UsersModule {}
