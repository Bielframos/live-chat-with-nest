import { Module } from '@nestjs/common';
import { ChatGateway } from './gateways/chat.gateway';
import { ChatService } from './services/chat.services';

@Module({
  providers: [ChatGateway, ChatService],
})
export class WebsocketModule {}
