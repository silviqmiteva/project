import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UsersService;
  let jwtService: JwtService;

  const mockUsersService = {
    findOne: jest.fn(),
    createUser: jest.fn(),
    findOneAndUpdate: jest.fn(),
    logoutUser: jest.fn(),
    findOneByUserIdAndUpdatToken: jest.fn(),
  };
  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should validate user', async () => {
    const validateUser = jest.spyOn(authService, 'validateUser');
    const find = jest.spyOn(userService, 'findOne');

    await authService.validateUser('', '');
    expect(validateUser).toBeCalledTimes(1);
    expect(find).toBeCalledTimes(1);
  });

  it('should get jwt token', async () => {
    const getJwtToken = jest.spyOn(authService, 'getJwtToken');
    const signToken = jest.spyOn(jwtService, 'sign');
    await authService.getJwtToken({
      username: 'irena',
      _id: 1,
      role: 'admin',
    });

    expect(getJwtToken).toBeCalledTimes(1);
    expect(signToken).toBeCalledTimes(1);
    signToken.mockReset();
    signToken.mockRestore();
  });

  it('should register user', async () => {
    const register = jest.spyOn(authService, 'registerUser');
    const createUser = jest.spyOn(userService, 'createUser');

    await authService.registerUser({});
    expect(register).toBeCalledTimes(1);
    expect(createUser).toBeCalledTimes(1);
  });

  it('should get refresh token', async () => {
    const getRefreshToken = jest.spyOn(authService, 'getRefreshToken');
    const signToken = jest.spyOn(jwtService, 'sign');
    const findOneAndUpdate = jest.spyOn(
      userService,
      'findOneByUserIdAndUpdatToken',
    );

    await authService.getRefreshToken('');
    expect(getRefreshToken).toBeCalledTimes(1);
    expect(signToken).toBeCalledTimes(1);
    expect(findOneAndUpdate).toBeCalledTimes(1);
  });

  it('should logout user', async () => {
    const logout = jest.spyOn(authService, 'logout');
    const logoutUser = jest.spyOn(userService, 'logoutUser');

    await authService.logout('1');
    expect(logout).toBeCalledTimes(1);
    expect(logoutUser).toBeCalledTimes(1);
  });
});
