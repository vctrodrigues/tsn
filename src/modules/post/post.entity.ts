import {
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  Entity,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { classToPlain } from 'class-transformer';
import { Comment } from './comment/comment.entity';
import { User } from '../user/user.entity';
import { Like } from './like/like.entity';

@Entity('post')
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.posts, { eager: true })
  @JoinTable({ name: 'user' })
  user: User;

  @Column({ type: 'text' })
  text: string;

  @Column({ type: 'varchar', length: 150 })
  media: string;

  @OneToMany(() => Comment, (comment) => comment.post, { eager: true })
  @JoinTable({ name: 'comment' })
  comments: Comment[];

  @OneToMany(() => Like, (like) => like.post, { eager: true })
  @JoinTable({ name: 'like' })
  likes: Like[];

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
