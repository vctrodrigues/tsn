import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { HTTPResponse } from '../../../helpers/responses';
import { User } from '../../user/user.entity';
import { DeleteResult, Repository } from 'typeorm';
import { Post } from '../post.entity';
import { Like } from './like.entity';
import { DB } from 'src/helpers/constants';

@Injectable()
export class LikeService {
  constructor(
    @Inject(DB.LIKE.REPOSITORY)
    private readonly _likeRepository: Repository<Like>,
  ) {}

  async create(like: Like): Promise<Like> {
    try {
      return await this._likeRepository.save(like);
    } catch (exception) {
      throw exception;
    }
  }

  async delete(id: string): Promise<DeleteResult> {
    if (!(await this._likeRepository.findOne({ where: { id } }))) {
      throw new BadRequestException(HTTPResponse.NOT_FOUND);
    }

    return await this._likeRepository.delete(id);
  }

  async find(user: User, post: Post): Promise<Like> {
    return await this._likeRepository.findOne({
      where: { user: { id: user.id }, post: { id: post.id } },
    });
  }
}
