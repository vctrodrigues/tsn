import { Role } from './../roles/role.enum';
import {
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  Entity,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinTable,
} from 'typeorm';
import { classToPlain, Exclude } from 'class-transformer';
import { Post } from '../post/post.entity';
import { Comment } from '../post/comment/comment.entity';
import { Like } from '../post/like/like.entity';
import { Conversation } from '../conversation/conversation.entity';
import { Message } from '../conversation/message/message.entity';

@Entity('user')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'char', nullable: false, length: 11 })
  cpf: string;

  @Column({ type: 'varchar', nullable: false, length: 40 })
  email: string;

  @Column({ type: 'varchar', nullable: false, length: 50 })
  name: string;

  @Column({ type: 'varchar', nullable: false, length: 50 })
  username: string;

  @Column({ type: 'varchar', length: 250 })
  bio: string;

  @Column({ type: 'varchar', length: 150 })
  picture: string;

  @Exclude({ toPlainOnly: true })
  @Column({ type: 'varchar', nullable: false, length: 255 })
  password: string;

  @Column({ type: 'varchar', default: Role.USER, nullable: true, length: 14 })
  role: Role;

  @OneToMany(() => Message, (message) => message.fromUser)
  messages: Message[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => Like, (like) => like.user)
  likes: Like[];

  @CreateDateColumn()
  created_at: string;

  @UpdateDateColumn()
  updated_at: string;

  @DeleteDateColumn()
  deleted_at: string;

  @OneToMany(() => Post, (post) => post.user)
  @JoinTable({ name: 'post' })
  posts: Post[];

  @OneToMany(() => Conversation, (conversation) => conversation.fromUser)
  invites_sent: Conversation[];

  @OneToMany(() => Conversation, (conversation) => conversation.toUser)
  invites_received: Conversation[];

  toJSON() {
    return classToPlain(this);
  }
}
