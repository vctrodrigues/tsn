import { Inject, Injectable } from '@nestjs/common';
import { Message } from './message.entity';
import { DeleteResult, Repository } from 'typeorm';
import { DB } from 'src/helpers/constants';

@Injectable()
export class MessageService {
  constructor(
    @Inject(DB.MESSAGE.REPOSITORY)
    private readonly _messageRepository: Repository<Message>,
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
