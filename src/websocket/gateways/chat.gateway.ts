import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from '../services/chat.services';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private chatService: ChatService) {}

  handleConnection() {
    this.chatService.setServer(this.server);
  }

  handleDisconnect(client: Socket) {
    this.chatService.handleDisconect(client);
  }

  @SubscribeMessage('username')
  handleUsername(client: Socket, username: string) {
    this.chatService.handleUsername(client, username);
  }

  @SubscribeMessage('chat:message')
  handleChatMessage(client: Socket, message: string) {
    this.chatService.handleChatMessage(client, message);
  }
}
