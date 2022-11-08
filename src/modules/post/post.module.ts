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
@Module({
  imports: [SharedModule, DatabaseModule],
  providers: [
    ...postProviders,
    ...likeProviders,
    ...commentProviders,
    PostService,
    LikeService,
    CommentService,
  ],
  controllers: [PostController],
  exports: [PostService, LikeService, CommentService],
})
export class PostModule {}
