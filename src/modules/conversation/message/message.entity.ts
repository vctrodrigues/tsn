import {
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  Entity,
  CreateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinTable,
} from 'typeorm';
import { classToPlain } from 'class-transformer';
import { Conversation } from '../conversation.entity';
import { User } from 'src/modules/user/user.entity';

@Entity('message')
export class Message extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Conversation, (conversation) => conversation.messages)
  conversation: Conversation;

  @ManyToOne(() => User, (user) => user.messages, { eager: true })
  @JoinTable()
  fromUser: User;

  @Column({ type: 'text', nullable: false })
  text: string;

  @CreateDateColumn()
  created_at;

  @DeleteDateColumn()
  deleted_at;

  toJSON() {
    return classToPlain(this);
  }
}
