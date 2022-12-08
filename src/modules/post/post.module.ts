import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { LikeService } from './like/like.service';
import { CommentService } from './comment/comment.service';
import { SharedModule } from '../../shared/shared.module';
import { postProviders } from './post.providers';
import { DatabaseModule } from 'src/database/database.module';
import { commentProviders } from './comment/comment.providers';
import { likeProviders } from './like/like.providers';
import { ConfigService } from '@nestjs/config';
@Module({
  imports: [SharedModule, DatabaseModule],
  providers: [
    ...postProviders,
    ...likeProviders,
    ...commentProviders,
    PostService,
    LikeService,
    CommentService,
    ConfigService,
  ],
  controllers: [PostController],
  exports: [PostService, LikeService, CommentService, ConfigService],
})
export class PostModule {}
