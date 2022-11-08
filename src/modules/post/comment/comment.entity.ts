import { classToPlain } from 'class-transformer';
import { User } from '../../user/user.entity';
import {
  BaseEntity,
  Entity,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  Column,
  JoinTable,
} from 'typeorm';
import { Post } from '../post.entity';

@Entity('comment')
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Post, (post) => post.comments)
  post: Post;

  @ManyToOne(() => User, (user) => user.comments, { eager: true })
  @JoinTable({ name: 'user' })
  user: User;

  @Column({ type: 'text', nullable: false })
  text: string;

  @CreateDateColumn()
  created_at;

  @UpdateDateColumn()
  updated_at;

  @DeleteDateColumn()
  deleted_at;

  toJSON() {
    return classToPlain(this);
  }
}
