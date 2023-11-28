import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

interface Message {
  content: string;
  sender: string;
  timestamp: Date;
}

@Injectable()
export class ChatService {
  private server: Server;
  private usersMap: Map<string, string> = new Map();
  private messages: Message[] = [];

  setServer(server: Server) {
    this.server = server;
  }

  private addUser(id: string, username: string) {
    this.usersMap.set(id, username);
  }

  private removeUser(id: string) {
    this.usersMap.delete(id);
  }

  private getUser(id: string): string | undefined {
    const name = this.usersMap.get(id);
    return name;
  }

  handleDisconect(client: Socket) {
    this.removeUser(client.id);
    const users = Array.from(this.usersMap.values());
    this.server.emit('users', users);
  }

  handleUsername(client: Socket, username: string) {
    this.addUser(client.id, username);
    const users = Array.from(this.usersMap.values());
    this.server.emit('users', users);
  }

  handleChatMessage(client: Socket, message: string) {
    const newMessage: Message = {
      content: message,
      sender: this.getUser(client.id),
      timestamp: new Date(),
    };

    this.messages.push(newMessage);
    this.server.emit('chat:message', newMessage);
  }
}
