import { Like } from './like.entity';
import { Repository, EntityRepository } from 'typeorm';

@EntityRepository(Like)
export class LikeRepository extends Repository<Like> {}
