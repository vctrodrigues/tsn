import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Post } from './post.entity';
import { HTTPResponse } from '../../helpers/responses';
import { DeleteResult, Repository } from 'typeorm';
import { DB } from 'src/helpers/constants';

@Injectable()
export class PostService {
  constructor(
    @Inject(DB.POST.REPOSITORY)
    private readonly _postRepository: Repository<Post>,
  ) {}

  async findById(id: string): Promise<Post> {
    return await this._postRepository.findOne({ where: { id } });
  }

  async findByUser(user_id: string): Promise<Post[]> {
    return await this._postRepository.find({
      where: { user: { id: user_id } },
      order: { created_at: 'DESC' },
    });
  }

  async getAll(): Promise<Post[]> {
    return await this._postRepository.find({
      order: { created_at: 'DESC' },
    });
  }

  async create(post: Post): Promise<Post> {
    try {
      return await this._postRepository.save(post);
    } catch (exception) {
      throw exception;
    }
  }

  async delete(uuid: string): Promise<DeleteResult> {
    if (!(await this._postRepository.findOne({ where: { id: uuid } }))) {
      throw new BadRequestException(HTTPResponse.NOT_FOUND);
    }

    return await this._postRepository.delete(uuid);
  }

  async update(post: Post): Promise<Post> {
    try {
      const oldPost = await this._postRepository.findOne({
        where: { id: post.id },
      });
      if (oldPost) {
        if (oldPost.user.id === post.user.id) {
          if (this._postRepository.update(post.id, post)) {
            return this._postRepository.findOne({ where: { id: post.id } });
          } else {
            throw new BadRequestException(HTTPResponse.UNKNOWN_ERROR);
          }
        } else {
          throw new ForbiddenException(HTTPResponse.NOT_AUTHORIZED);
        }
      } else {
        throw new BadRequestException(HTTPResponse.NOT_FOUND);
      }
    } catch (exception) {
      throw exception;
    }
  }
}
