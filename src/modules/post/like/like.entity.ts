import { classToPlain } from 'class-transformer';
import { User } from '../../user/user.entity';
import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Post } from '../post.entity';

@Entity('like')
export class Like extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Post, (post) => post.likes)
  post: Post;

  @ManyToOne(() => User, (user) => user.likes, { eager: true })
  @JoinTable({ name: 'user' })
  user: User;

  @CreateDateColumn()
  created_at;

  toJSON() {
    return classToPlain(this);
  }
}
