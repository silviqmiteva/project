import { Test, TestingModule } from '@nestjs/testing';
import { BlacklistRepository } from './repositories/blacklist.repository';
import { RoleRepository } from './repositories/role.repository';
import { UserRepository } from './repositories/users.repository';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: UserRepository;
  let blacklistRepository: BlacklistRepository;
  let roleRepository: RoleRepository;

  const mockUserRepository = {
    create: jest.fn(({}) => {
      return;
    }),
    findOne: jest.fn((username: string) => {
      return { refresh_token: '123a' };
    }),
    findOneAndUpdate: jest.fn(),
    getAllUsers: jest.fn(),
    deleteManyUsers: jest.fn(),
  };
  const mockBlacklistRepository = {
    create: jest.fn(),
    findOne: jest.fn(),
  };
  const mockRoleRepository = {
    create: jest.fn(),
    deleteManyRoles: jest.fn(),
  };

  const user = {
    username: 'irena',
    password: '1234354554',
    email: 'irena@gmail.com',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: UserRepository, useValue: mockUserRepository },
        { provide: BlacklistRepository, useValue: mockBlacklistRepository },
        { provide: RoleRepository, useValue: mockRoleRepository },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<UserRepository>(UserRepository);
    blacklistRepository = module.get<BlacklistRepository>(BlacklistRepository);
    roleRepository = module.get<RoleRepository>(RoleRepository);
  });

  it('should create user', async () => {
    const createUser = jest.spyOn(service, 'createUser');
    const create = jest.spyOn(userRepository, 'create');

    await service.createUser(user);
    expect(createUser).toBeCalledTimes(1);
    expect(create).toBeCalledTimes(1);
  });

  it('should find user', async () => {
    const findOne = jest.spyOn(service, 'findOne');
    const find = jest.spyOn(userRepository, 'findOne');

    await service.findOne('');
    expect(findOne).toBeCalledTimes(1);
    expect(find).toBeCalledTimes(1);
  });

  it('should find user and update', async () => {
    const findOne = jest.spyOn(service, 'findOneAndUpdate');
    const find = jest.spyOn(userRepository, 'findOneAndUpdate');

    await service.findOneAndUpdate({}, {});
    expect(findOne).toBeCalledTimes(1);
    expect(find).toBeCalledTimes(1);
  });

  it('should get all users', async () => {
    const getUsers = jest.spyOn(service, 'getAllUsers');
    const getAll = jest.spyOn(userRepository, 'getAllUsers');

    await service.getAllUsers();
    expect(getUsers).toBeCalledTimes(1);
    expect(getAll).toBeCalledTimes(1);
  });

  it('should get user by refresh token', async () => {
    jest.clearAllMocks();
    const getUserByToken = jest.spyOn(service, 'getUserByRefreshToken');
    const getAll = jest.spyOn(userRepository, 'findOne');

    await service.getUserByRefreshToken('');
    expect(getUserByToken).toBeCalledTimes(1);
    expect(getAll).toBeCalledTimes(1);
  });

  it('should get user data from id', async () => {
    jest.clearAllMocks();
    const getUserById = jest.spyOn(service, 'getUserData');
    const find = jest.spyOn(userRepository, 'findOne');

    await service.getUserData('');
    expect(getUserById).toBeCalledTimes(1);
    expect(find).toBeCalledTimes(1);
  });

  it('should logout user', async () => {
    jest.clearAllMocks();
    const logout = jest.spyOn(service, 'logoutUser');
    const find = jest.spyOn(userRepository, 'findOne');
    const create = jest.spyOn(blacklistRepository, 'create');
    const updateToken = jest.spyOn(userRepository, 'findOneAndUpdate');

    await service.logoutUser('61e692115985e38070a9a629');
    expect(logout).toBeCalledTimes(1);
    expect(find).toBeCalledTimes(1);
    expect(create).toBeCalledTimes(1);
    expect(updateToken).toBeCalledTimes(1);
  });

  it('should create new role', async () => {
    jest.clearAllMocks();
    const createRole = jest.spyOn(service, 'createRole');
    const create = jest.spyOn(roleRepository, 'create');

    await service.createRole('');
    expect(createRole).toBeCalledTimes(1);
    expect(create).toBeCalledTimes(1);
  });

  it('should get token from blacklist', async () => {
    jest.clearAllMocks();
    const getToken = jest.spyOn(service, 'getTokenFromBlacklist');
    const create = jest.spyOn(blacklistRepository, 'findOne');

    await service.getTokenFromBlacklist('');
    expect(getToken).toBeCalledTimes(1);
    expect(create).toBeCalledTimes(1);
  });

  it('should delete roles', async () => {
    jest.clearAllMocks();
    const deleteRoles = jest.spyOn(service, 'deleteRoles');
    const deleteMany = jest.spyOn(roleRepository, 'deleteManyRoles');

    await service.deleteRoles({ rolesId: ['1', '2'] });
    expect(deleteRoles).toBeCalledTimes(1);
    expect(deleteMany).toBeCalledTimes(1);
  });

  it('should delete users', async () => {
    jest.clearAllMocks();
    const deleteUsers = jest.spyOn(service, 'deleteUsers');
    const deleteManyUsr = jest.spyOn(userRepository, 'deleteManyUsers');

    await service.deleteUsers({ usersId: ['1', '2'] });
    expect(deleteUsers).toBeCalledTimes(1);
    expect(deleteManyUsr).toBeCalledTimes(1);
  });
});
