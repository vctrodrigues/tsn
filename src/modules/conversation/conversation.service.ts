import { BadRequestException, Injectable } from '@nestjs/common';
import { ConversationRepository } from './conversation.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Conversation } from './conversation.entity';
import { DeleteResult, UpdateResult } from 'typeorm';
import { HTTPResponse } from '../../helpers/responses';

@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(ConversationRepository)
    private readonly _conversationRepository: ConversationRepository,
  ) {}

  async findById(id: string, user_id: string): Promise<Conversation> {
    return await this._conversationRepository.findOne({
      where: [
        { id, fromUser: { id: user_id } },
        { id, toUser: { id: user_id } },
      ],
    });
  }

  async findByUser(user_id: string, sender = false): Promise<Conversation[]> {
    const query = {};
    query[sender ? 'fromUser' : 'toUser'] = { id: user_id };

    return await this._conversationRepository.find({
      where: query,
    });
  }

  async findByUserWith(
    user_id: string,
    with_user: string,
  ): Promise<Conversation> {
    return await this._conversationRepository.findOne({
      where: [
        { toUser: { id: with_user }, fromUser: { id: user_id } },
        { fromUser: { id: with_user }, toUser: { id: user_id } },
      ],
    });
  }

  async findByUserActive(user_id: string): Promise<Conversation[]> {
    return await this._conversationRepository
      .createQueryBuilder('conversation')
      .where({ fromUser: user_id, active: true })
      .orWhere({ toUser: user_id, active: true })
      .getMany();
  }

  async create(conversation: Conversation): Promise<Conversation> {
    try {
      return await this._conversationRepository.save(conversation);
    } catch (exception) {
      throw exception;
    }
  }

  async update(
    uuid: string,
    conversation: Conversation,
  ): Promise<UpdateResult> {
    try {
      return await this._conversationRepository.update(uuid, conversation);
    } catch (exception) {
      throw exception;
    }
  }

  async delete(id: string, user_id: string): Promise<DeleteResult> {
    if (
      !(await this._conversationRepository.findOne({
        where: [
          { id, fromUser: user_id },
          { id, toUser: user_id },
        ],
      }))
    ) {
      throw new BadRequestException(HTTPResponse.NOT_FOUND);
    }

    return await this._conversationRepository.delete(id);
  }
}
