import { Injectable } from '@nestjs/common';
import { MessageRepository } from './message.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './message.entity';
import { DeleteResult } from 'typeorm';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(MessageRepository)
    private readonly _messageRepository: MessageRepository,
  ) {}

  async create(message: Message): Promise<Message> {
    try {
      return await this._messageRepository.save(message);
    } catch (exception) {
      throw exception;
    }
  }

  async findByConversation(conversation_id: string): Promise<Message[]> {
    return await this._messageRepository.find({
      where: {
        conversation: { id: conversation_id },
      },
      order: { created_at: 'DESC' },
    });
  }

  async delete(id: string): Promise<DeleteResult> {
    try {
      return await this._messageRepository.delete(id);
    } catch (exception) {
      throw exception;
    }
  }
}
