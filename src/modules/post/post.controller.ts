import createMessage, {
  PayloadInterface,
  Validation,
} from '../../helpers/payload.model';
import {
  Controller,
  Request,
  Get,
  Post,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  NotFoundException,
  Res,
  Patch,
} from '@nestjs/common';
import { PostService } from './post.service';
import { Post as PostEntity } from './post.entity';
import { HTTPResponse } from '../../helpers/responses';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { LikeService } from './like/like.service';
import { Like } from './like/like.entity';
import { CommentService } from './comment/comment.service';
import { Comment } from './comment/comment.entity';
import { diskStorage } from 'multer';
import fileUtils from '../../helpers/file';
import { User } from '../user/user.entity';

class PostDTO {
  text: string;
  like: boolean;

  constructor({ text, like }) {
    this.text = text;
    this.like = like;
  }

  toPost() {
    const post = new PostEntity();

    post.text = this.text;

    return post;
  }
}

@Controller('posts')
export class PostController {
  constructor(
    private readonly _postService: PostService,
    private readonly _likeService: LikeService,
    private readonly _commentService: CommentService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get(':uuid')
  async getPost(
    @Param('uuid', ParseUUIDPipe) uuid: string,
  ): Promise<PayloadInterface> {
    const post = await this._postService.findById(uuid);

    if (post) {
      return createMessage(true, '', post);
    }

    throw new NotFoundException(HTTPResponse.NOT_FOUND);
  }

  @Get('/user/:uuid')
  async getPostsByUser(
    @Param('uuid', ParseUUIDPipe) user_id: string,
  ): Promise<PayloadInterface> {
    const posts = await this._postService.findByUser(user_id);
    if (posts && posts.length > 0) {
      return createMessage(true, '', posts);
    }

    throw new NotFoundException(HTTPResponse.NOT_FOUND);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/feed')
  async getUserFeed(@Request() req): Promise<PayloadInterface> {
    const posts = await this._postService
      .getAll()
      .then((posts) => posts.filter((post) => post.user.id !== req.user.id));

    if (posts && posts.length > 0) {
      return createMessage(true, '', posts);
    }

    throw new NotFoundException(HTTPResponse.NOT_FOUND);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/feed/:user_id')
  async getPostsFromUser(
    @Param('user_id', ParseUUIDPipe) user_id: string,
  ): Promise<PayloadInterface> {
    const posts = await this._postService.findByUser(user_id);
    if (posts && posts.length > 0) {
      return createMessage(true, '', posts);
    }

    throw new NotFoundException(HTTPResponse.NOT_FOUND);
  }

  @Get()
  async getPosts(): Promise<PayloadInterface> {
    const posts = await this._postService.getAll();
    if (posts && posts.length > 0) {
      return createMessage(true, '', posts);
    }

    throw new NotFoundException(HTTPResponse.NOT_FOUND);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createPost(
    @Request() req,
    @Body() post: PostEntity,
  ): Promise<PayloadInterface> {
    try {
      post.user = req.user.id;

      const { validated, field } = this._validate(post);
      if (!validated) {
        return createMessage(false, HTTPResponse.BAD_REQUEST, null, field);
      }

      const createdPost = await this._postService.create(post);

      return createdPost
        ? createMessage(true, HTTPResponse.CREATED, createdPost)
        : createMessage(false, HTTPResponse.UNKNOWN_ERROR);
    } catch (exception) {
      return createMessage(false, exception);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('/media')
  @UseInterceptors(
    FileInterceptor('media', {
      storage: diskStorage({
        destination: fileUtils.destination,
        filename: fileUtils.filename,
      }),
      fileFilter: fileUtils.imageFileFilter,
    }),
  )
  async createMediaPost(
    @Request() req,
    @Body() post: PostEntity,
    @UploadedFile() media,
  ) {
    post.user = req.user.id;
    post.media = media.filename;
    const savedPost = await this._postService.create(post);
    savedPost
      ? createMessage(true, HTTPResponse.CREATED, savedPost)
      : createMessage(false, HTTPResponse.UNKNOWN_ERROR);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:uuid')
  async updatePost(
    @Request() req,
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() post: PostEntity,
  ) {
    post.user = req.user.id;
    post.id = uuid;
    try {
      const updatedPost = this._postService.update(post);

      return updatedPost
        ? createMessage(true, HTTPResponse.UPDATED, updatedPost)
        : createMessage(false, HTTPResponse.UNKNOWN_ERROR);
    } catch (exception) {
      return createMessage(false, exception);
    }
  }

  @Delete('/:uuid')
  async deletePost(
    @Param('uuid', ParseUUIDPipe) uuid: string,
  ): Promise<PayloadInterface> {
    try {
      const result = await this._postService.delete(uuid);
      return createMessage(true, HTTPResponse.DELETED, result.raw);
    } catch (exception) {
      return createMessage(false, exception);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('/:uuid/react')
  async reactPost(
    @Request() req,
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() postDTO,
  ): Promise<PayloadInterface> {
    postDTO = new PostDTO(postDTO);

    const { validated, field } = this._validate(postDTO);
    if (!validated) {
      return createMessage(false, HTTPResponse.BAD_REQUEST, null, field);
    }

    if (postDTO.like) {
      const like = new Like();
      like.post = new PostEntity();
      like.post.id = uuid;
      like.user = new User();
      like.user = req.user.id;

      try {
        if (await this._likeService.create(like)) {
          const post = await this._postService.findById(uuid);
          return createMessage(true, HTTPResponse.CREATED, post);
        }
      } catch (exception) {
        return createMessage(false, HTTPResponse.UNKNOWN_ERROR);
      }
    } else {
      const post = await this._postService.findById(uuid);
      const like = await this._likeService.find(req.user, post);

      try {
        if (like && (await this._likeService.delete(like.id))) {
          const updatedPost = await this._postService.findById(uuid);
          return createMessage(true, HTTPResponse.DELETED, updatedPost);
        }
      } catch (exception) {
        return createMessage(false, HTTPResponse.NOT_FOUND);
      }
    }

    return createMessage(false, HTTPResponse.NOT_FOUND);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:uuid/like')
  async likePost(
    @Request() req,
    @Param('uuid', ParseUUIDPipe) uuid: string,
  ): Promise<PayloadInterface> {
    const like = new Like();
    like.post = new PostEntity();
    like.post.id = uuid;
    like.user = new User();
    like.user = req.user.id;

    try {
      if (await this._likeService.create(like)) {
        const post = await this._postService.findById(uuid);
        return createMessage(true, HTTPResponse.CREATED, post);
      }
    } catch (exception) {
      return createMessage(false, HTTPResponse.UNKNOWN_ERROR);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:uuid/unlike')
  async unlikePost(
    @Request() req,
    @Param('uuid', ParseUUIDPipe) uuid: string,
  ): Promise<PayloadInterface> {
    const post = await this._postService.findById(uuid);
    const like = await this._likeService.find(req.user, post);

    try {
      if (like && (await this._likeService.delete(like.id))) {
        const updatedPost = await this._postService.findById(uuid);
        return createMessage(true, HTTPResponse.DELETED, updatedPost);
      }
    } catch (exception) {
      return createMessage(false, HTTPResponse.NOT_FOUND);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('/:uuid/comment')
  async commentPost(
    @Request() req,
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() comment: Comment,
  ): Promise<PayloadInterface> {
    comment.post = new PostEntity();
    comment.post.id = uuid;
    comment.user = req.user.id;

    const { validated, field } = this._validateComment(comment);
    if (!validated) {
      return createMessage(false, HTTPResponse.BAD_REQUEST, null, field);
    }

    try {
      if (await this._commentService.create(comment)) {
        const post = await this._postService.findById(uuid);
        return createMessage(true, HTTPResponse.CREATED, post);
      }
    } catch (exception) {
      return createMessage(false, HTTPResponse.UNKNOWN_ERROR);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:post_id/comment/:comment_id')
  async deleteComment(
    @Request() req,
    @Param('post_id', ParseUUIDPipe) post_id: string,
    @Param('comment_id', ParseUUIDPipe) comment_id: string,
  ): Promise<PayloadInterface> {
    const post = await this._postService.findById(post_id);
    const comment = await this._commentService.find(req.user, post, comment_id);

    if (await this._commentService.delete(comment.id)) {
      return createMessage(true, HTTPResponse.DELETED);
    }

    throw new NotFoundException(HTTPResponse.NOT_FOUND);
  }

  @Get('/image/:filename')
  async getImage(@Param('filename') media: string, @Res() res) {
    res.sendFile(media, { root: 'uploads' });
  }

  _validate(post: PostEntity | PostDTO): Validation {
    const fields = ['text'];

    for (const field of fields) {
      if (!post[field]) {
        return {
          validated: false,
          field,
        };
      }
    }

    return {
      validated: true,
    };
  }

  _validateComment(comment: Comment): Validation {
    const fields = ['text'];

    for (const field of fields) {
      if (!comment[field]) {
        return {
          validated: false,
          field,
        };
      }
    }

    return {
      validated: true,
    };
  }
}
