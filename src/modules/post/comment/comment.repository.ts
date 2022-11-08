import { Comment } from './comment.entity';
import { Repository, EntityRepository } from 'typeorm';

@EntityRepository(Comment)
export class CommentRepository extends Repository<Comment> {}
