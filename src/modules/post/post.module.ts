import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostRepository } from './post.repository';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { LikeRepository } from './like/like.repository';
import { LikeService } from './like/like.service';
import { CommentRepository } from './comment/comment.repository';
import { CommentService } from './comment/comment.service';
import { SharedModule } from '../../shared/shared.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([PostRepository]),
    TypeOrmModule.forFeature([LikeRepository]),
    TypeOrmModule.forFeature([CommentRepository]),
    SharedModule,
  ],
  providers: [PostService, LikeService, CommentService],
  controllers: [PostController],
  exports: [PostService, LikeService, CommentService],
})
export class PostModule {}
