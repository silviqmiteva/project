import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const user = {
    username: 'irena',
    password: '1234354554',
    email: 'irena@gmail.com',
  };

  const mockRequest: any = {
    user: { _id: 1 },
    cookies: { refresh_token: '' },
    body: { userId: 1, test: 'hello' },
  };

  const mockResponse: any = {
    cookie: function () {
      return {};
    },
  };

  const mockAuthService = {
    getJwtToken: jest.fn(() => {
      return expect.any(String);
    }),
    getRefreshToken: jest.fn((id: string) => {
      return expect.any(String);
    }),
    registerUser: jest.fn((dto) => {
      return {
        _id: expect.any(String),
        ...dto,
      };
    }),
    logout: jest.fn((id: string, token: string) => {
      return;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    })
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should register new user', () => {
    expect(controller.register(user)).toEqual({
      _id: expect.any(String),
      username: 'irena',
      password: expect.any(String),
      email: 'irena@gmail.com',
    });

    const el = jest.spyOn(service, 'registerUser');
    expect(mockAuthService.registerUser).toHaveBeenCalledWith(user);
    expect(el).toBeCalledTimes(1);
  });

  it('should logout user', () => {
    const el = jest.spyOn(controller, 'logout');
    const logout = jest.spyOn(service, 'logout');
    controller.logout(mockRequest);

    expect(el).toBeCalledTimes(1);
    expect(logout).toBeCalledTimes(1);
    expect(el).toHaveBeenCalledWith(mockRequest);
  });

  it('should login user', async () => {
    const el = jest.spyOn(controller, 'login');
    const aToken = jest.spyOn(service, 'getJwtToken');
    const rToken = jest.spyOn(service, 'getRefreshToken');
    await controller.login(mockRequest, mockResponse);

    expect(el).toBeCalledTimes(1);
    expect(el).toHaveBeenCalledWith(mockRequest, mockResponse);
    expect(rToken).toBeCalledTimes(1);
    expect(aToken).toBeCalledTimes(1);
    el.mockReset();
    el.mockRestore();
  });

  it('should access protected test route', () => {
    const el = jest.spyOn(controller, 'test');
    const result = controller.test(mockRequest, mockResponse);

    expect(el).toBeCalledTimes(1);
    expect(el).toHaveBeenLastCalledWith(mockRequest, mockResponse);
    expect(result).toMatchObject({
      text: 'this is test protected route hello',
    });
    el.mockReset();
    el.mockRestore();
  });
});
