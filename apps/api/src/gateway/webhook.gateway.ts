import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({ cors: { origin: '*' }, namespace: '/' })
export class WebhookGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger = new Logger('WebhookGateway');

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    const endpointId = client.handshake.query.endpointId as string;
    if (endpointId) client.join(`endpoint:${endpointId}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  emitNewRequest(endpointId: string, request: unknown) {
    this.server.to(`endpoint:${endpointId}`).emit('new_request', request);
  }
}
