import {
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  Entity,
  CreateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
  JoinTable,
} from 'typeorm';
import { classToPlain } from 'class-transformer';
import { User } from '../user/user.entity';
import { Message } from './message/message.entity';

@Entity('conversation')
export class Conversation extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.invites_sent, { eager: true })
  @JoinTable()
  fromUser: User;

  @ManyToOne(() => User, (user) => user.invites_received, { eager: true })
  @JoinTable()
  toUser: User;

  @Column({ type: 'boolean', nullable: false })
  accepted: boolean;

  @CreateDateColumn()
  created_at;

  @DeleteDateColumn()
  deleted_at;

  @OneToMany(() => Message, (message) => message.conversation, { eager: true })
  @JoinTable({ name: 'message' })
  messages: Message[];

  toJSON() {
    return classToPlain(this);
  }
}
