import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { HTTPResponse } from '../../../helpers/responses';
import { DeleteResult, Repository } from 'typeorm';
import { User } from '../../user/user.entity';
import { Post } from '../post.entity';
import { Comment } from './comment.entity';
import { DB } from 'src/helpers/constants';

@Injectable()
export class CommentService {
  constructor(
    @Inject(DB.COMMENT.REPOSITORY)
    private readonly _commentRepository: Repository<Comment>,
  ) {}

  async create(comment: Comment): Promise<Comment> {
    try {
      return await this._commentRepository.save(comment);
    } catch (exception) {
      throw exception;
    }
  }

  async delete(id: string): Promise<DeleteResult> {
    if (!(await this._commentRepository.findOne({ where: { id } }))) {
      throw new BadRequestException(HTTPResponse.NOT_FOUND);
    }

    return await this._commentRepository.delete(id);
  }

  async find(user: User, post: Post, id: string): Promise<Comment> {
    return await this._commentRepository.findOne({
      where: { id, user: { id: user.id }, post: { id: post.id } },
    });
  }
}
