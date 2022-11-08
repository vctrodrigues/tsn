import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { WsException } from '@nestjs/websockets';
import { AuthService } from 'src/auth/auth.service';
import { Message } from '../message/message.entity';
import { Conversation } from '../conversation.entity';
import { User } from 'src/modules/user/user.entity';
import { MessageService } from '../message/message.service';
import { ConversationService } from '../conversation.service';

@Injectable()
export class ChatService {
  constructor(
    private readonly _authService: AuthService,
    private readonly _messageService: MessageService,
    private readonly _conversationService: ConversationService,
  ) {}

  async getUserFromSocket(socket: Socket) {
    if (!socket.handshake.auth.token) {
      throw new WsException('Invalid credentials');
    }

    const user = await this._authService.getUserByToken(
      socket.handshake.auth.token,
    );

    if (!user) {
      throw new WsException('Invalid credentials');
    }

    return user;
  }

  async saveMessage(text: string, conversation_id: string, user: User) {
    const message = new Message();
    message.text = text;
    message.fromUser = user;

    message.conversation = new Conversation();
    message.conversation.id = conversation_id;

    return await this._messageService.create(message);
  }

  async getConversationMessages(conversation_id: string, user: User) {
    if (await this._conversationService.findById(conversation_id, user.id)) {
      return await this._messageService.findByConversation(conversation_id);
    }

    throw new WsException('Conversation not found');
  }

  async validateConversation(conversation_id: string, user: User) {
    return await this._conversationService.findById(conversation_id, user.id);
  }
}
