import { Conversation } from './conversation.entity';
import { Repository, EntityRepository } from 'typeorm';

@EntityRepository(Conversation)
export class ConversationRepository extends Repository<Conversation> {}
