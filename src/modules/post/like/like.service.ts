import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HTTPResponse } from '../../../helpers/responses';
import { User } from '../../user/user.entity';
import { DeleteResult } from 'typeorm';
import { Post } from '../post.entity';
import { Like } from './like.entity';
import { LikeRepository } from './like.repository';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(LikeRepository)
    private readonly _likeRepository: LikeRepository,
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
