import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: { origin: 'http://localhost:3001' },
})
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(private readonly _chatService: ChatService) {}

  async handleConnection(socket: Socket) {
    await this._chatService.getUserFromSocket(socket);
  }

  @SubscribeMessage('start_chat')
  async startChat(
    @ConnectedSocket() socket: Socket,
    @MessageBody() conversation_id: string,
  ) {
    const user = await this._chatService.getUserFromSocket(socket);
    const conversation = await this._chatService.validateConversation(
      conversation_id,
      user,
    );

    socket.join(conversation.id);
    socket.emit('chat_started', { room: conversation.id });
  }

  @SubscribeMessage('send_message')
  async sendMessage(
    @MessageBody()
    { content, conversation_id }: { content: string; conversation_id: string },
    @ConnectedSocket() socket: Socket,
  ) {
    const author = await this._chatService.getUserFromSocket(socket);
    const message = await this._chatService.saveMessage(
      content,
      conversation_id,
      author,
    );

    this.server.sockets.to(conversation_id).emit('receive_message', message);
  }

  @SubscribeMessage('request_messages')
  async requestMessages(
    @MessageBody() conversation_id: string,
    @ConnectedSocket() socket: Socket,
  ) {
    const user = await this._chatService.getUserFromSocket(socket);
    const messages = await this._chatService.getConversationMessages(
      conversation_id,
      user,
    );

    socket.emit('send_all_messages', messages);
  }
}
