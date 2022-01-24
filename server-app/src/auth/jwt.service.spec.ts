import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { TokenService } from './jwt.service';

describe('TokenService', () => {
  let tokenService: TokenService;
  let jwtService: JwtService;
  let authService: AuthService;
  let userService: UsersService;

  const user = {
    username: 'ivan',
    _id: 1,
  };
  const mockJwtService = {
    verify: jest.fn(),
  };
  const mockUserService = {
    getTokenFromBlacklist: jest.fn(),
    getUserByRefreshToken: jest.fn((refToken) => {
      return user;
    }),
  };
  const mockAuthService = {
    getJwtToken: jest.fn((user) => {
      return {
        access_token: 'test',
      };
    }),
    getRefreshToken: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        { provide: JwtService, useValue: mockJwtService },
        { provide: UsersService, useValue: mockUserService },
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    tokenService = module.get<TokenService>(TokenService);
    jwtService = module.get<JwtService>(JwtService);
    authService = module.get<AuthService>(AuthService);
    userService = module.get<UsersService>(UsersService);
  });

  it('should verify token', async () => {
    const verifyToken = jest.spyOn(tokenService, 'verifyToken');
    const verify = jest.spyOn(jwtService, 'verify');

    await tokenService.verifyToken('', '');
    expect(verifyToken).toHaveBeenCalled();
    expect(verify).toHaveBeenCalled();
  });

  it('should generate new tokens', async () => {
    const generateNewTokens = jest.spyOn(tokenService, 'generateNewTokens');
    const checkTokenInBlacklist = jest.spyOn(
      userService,
      'getTokenFromBlacklist',
    );
    const getUserByRefreshToken = jest.spyOn(
      userService,
      'getUserByRefreshToken',
    );
    const getNewJwtToken = jest.spyOn(authService, 'getJwtToken');
    const getRefreshToken = jest.spyOn(authService, 'getRefreshToken');

    await tokenService.generateNewTokens('');
    expect(checkTokenInBlacklist).toHaveBeenCalledTimes(1);
    expect(generateNewTokens).toHaveBeenCalledTimes(1);
    expect(getUserByRefreshToken).toHaveBeenCalledTimes(1);
    expect(getNewJwtToken).toHaveBeenCalledTimes(1);
    expect(getRefreshToken).toHaveBeenCalledTimes(1);
  });
});
