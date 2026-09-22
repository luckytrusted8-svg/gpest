import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class TrackingGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(TrackingGateway.name);

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join:tenant')
  handleJoinTenant(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { tenantId: string },
  ) {
    if (data?.tenantId) {
      client.join(`tenant:${data.tenantId}`);
      this.logger.log(`Client ${client.id} joined room tenant:${data.tenantId}`);
    }
  }

  @SubscribeMessage('technician:location_update')
  handleLocationUpdate(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: {
      tenantId: string;
      techId: string;
      techName: string;
      taskId?: string;
      latitude: number;
      longitude: number;
      speed?: number;
      heading?: number;
      battery?: number;
    },
  ) {
    // Broadcast live location to supervisors in the tenant room
    if (data?.tenantId) {
      this.server.to(`tenant:${data.tenantId}`).emit('tech:live_position', {
        ...data,
        timestamp: new Date().toISOString(),
      });
    }
    return { success: true };
  }
}
