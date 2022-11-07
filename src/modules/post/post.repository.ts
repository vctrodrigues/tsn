import { Post } from './post.entity';
import { Repository, EntityRepository } from 'typeorm';

@EntityRepository(Post)
export class PostRepository extends Repository<Post> {}
