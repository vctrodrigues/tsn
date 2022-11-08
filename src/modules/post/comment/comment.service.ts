import { BadRequestException, Injectable } from '@nestjs/common';
import { CommentRepository } from './comment.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { HTTPResponse } from '../../../helpers/responses';
import { DeleteResult } from 'typeorm';
import { User } from '../../user/user.entity';
import { Post } from '../post.entity';
import { Comment } from './comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentRepository)
    private readonly _commentRepository: CommentRepository,
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
    return await this._commentRepository.findOne({ where: { id, user, post } });
  }
}
