import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = {
    getAllUsers: jest.fn(() => {
      return [];
    }),
    getUserData: jest.fn((dto) => {
      return {
        ...dto,
      };
    }),
    createRole: jest.fn((role) => {
      return;
    }),
    deleteUsers: jest.fn(),
    deleteRoles: jest.fn(),
  };

  const req: any = {
    user: { _id: 1 },
    cookies: { refresh_token: '' },
    body: { userId: 1, test: 'hello' },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    })
      .overrideProvider(UsersService)
      .useValue(mockUsersService)
      .compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should get all users', () => {
    const getUsers = jest.spyOn(service, 'getAllUsers');
    const el = jest.spyOn(controller, 'getAll');
    controller.getAll();
    expect(el).toBeCalledTimes(1);
    expect(getUsers).toBeCalledTimes(1);
  });

  it('should get user profile data', () => {
    const getUserData = jest.spyOn(service, 'getUserData');
    const el = jest.spyOn(controller, 'getProfile');
    controller.getProfile(req);
    expect(el).toBeCalledTimes(1);
    expect(getUserData).toBeCalledTimes(1);
  });

  it('should create a user role', () => {
    const newRole = jest.spyOn(controller, 'createRole');
    const createRole = jest.spyOn(service, 'createRole');
    controller.createRole({
      name: 'roleNew',
    });
    expect(newRole).toBeCalledTimes(1);
    expect(createRole).toBeCalledTimes(1);
  });

  it('should delete users', () => {
    const users = jest.spyOn(controller, 'deleteUsers');
    const deleteUsers = jest.spyOn(service, 'deleteUsers');
    controller.deleteUsers({
      usersId: ['1', '2'],
    });
    expect(users).toBeCalledTimes(1);
    expect(deleteUsers).toBeCalledTimes(1);
  });

  it('should delete roles', () => {
    const roles = jest.spyOn(controller, 'deleteRoles');
    const deleteRoles = jest.spyOn(service, 'deleteRoles');
    controller.deleteRoles({
      rolesId: ['1', '2'],
    });
    expect(roles).toBeCalledTimes(1);
    expect(deleteRoles).toBeCalledTimes(1);
  });
});
