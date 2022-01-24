import { Test, TestingModule } from '@nestjs/testing';
import { AppGateway } from './app.gateway';
import { Socket, Server } from 'socket.io';
import { WebSocketServer } from '@nestjs/websockets';

describe('AppGateway', () => {
  let gateway: AppGateway;
  const server: any = WebSocketServer;
  const client: any = Socket;
  client.id = '1';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppGateway],
    }).compile();

    gateway = module.get<AppGateway>(AppGateway);
  });

  it('should handle after init', () => {
    const spy = jest.spyOn(gateway, 'afterInit');
    gateway.afterInit();
    expect(spy).toBeCalled();
  });

  it('should handle disconnect', () => {
    const spy = jest.spyOn(gateway, 'handleDisconnect');
    gateway.handleDisconnect(client);
    expect(spy).toHaveBeenCalled();
  });
});
