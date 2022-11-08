import { Message } from './message.entity';
import { Repository, EntityRepository } from 'typeorm';

@EntityRepository(Message)
export class MessageRepository extends Repository<Message> {}
